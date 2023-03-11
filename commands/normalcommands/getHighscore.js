const { MessageEmbed } = require("discord.js");
const hiscores = require("osrs-json-hiscores");
const Player = require("../../model/osrs");
const compare = require("../../helpers/functions/compare");
const _ = require("lodash");
const osrsSkills = require("../../helpers/osrs/skills");
const capatalize = require("../../helpers/functions/capatalize");

module.exports = {
  name: "highscore",
  description:
    "fetches the highscores and compares the levels stored in the database with the highscore data. if there are level increases the player will be congratiolated and the new data will be saved.",
  execute(channel, client) {
    Player.find()
      .exec()
      .then((docs) => {
        Object.keys(docs).forEach(async function (item) {
          try {
            await hiscores.getStats(docs[item].osrsName).then(async (res) => {
              const changes = compare(docs[item].stats, res.main.skills);
              const username = docs[item].osrsName.replace(new RegExp("_", "g"), " ");
              let levelups = [];

              if (_.isEmpty(changes)) {
                console.log("no changes");
                return;
              }

              for (const skill of Object.keys(changes).filter(
                (skill) => skill !== "overall" && changes[skill].hasOwnProperty("level")
              )) {
                const player = await Player.findOne({ _id: docs[item].id });
                if (docs[item].stats[skill].level < changes[skill].level) {
                  levelups.push({
                    skillName: skill,
                    oldLevel: docs[item].stats[skill].level,
                    newLevel: changes[skill].level,
                    skillColor: osrsSkills[skill].color,
                    skillIcon: osrsSkills[skill].placeholder,
                    skillCape: osrsSkills[skill].gif,
                    emoji: osrsSkills[skill].emoji,
                    compliment: osrsSkills[skill].compliment,
                  });
                  await updatePlayerStats(player, skill, changes[skill]);
                }
              }

              if (levelups.length > 0) {
                const embed = createEmbed(username, docs[item].discordId, levelups, client);
                await channel.send({ embeds: [embed] });
              }
            });
          } catch (err) {
            console.log(err);
          }
        });
      })
      .catch((err) => console.log(err));
  },
};

async function updatePlayerStats(player, skill, newStats) {
  player.stats[skill] = newStats;
  player.markModified("stats");
  return await player.save();
}

function createEmbed(username, discordId, levelups, client) {
  const guild = client.guilds.cache.get("867074325824012379");
  const user = guild.members.cache.get(discordId).user;

  const Embed = new MessageEmbed()
    .setTitle(`Congratulations, adventurer!`)
    .setDescription(
      `**${capatalize(
        username
      )}** has just completed an epic journey, and we're excited to share their accomplishments with you. Behold the amazing levels they've gained:`
    )
    .setAuthor({ name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg` })
    .setTimestamp()
    .setColor(getHighestColor(levelups));

  let totalLevels = 0;
  let fields = [];

  levelups.map((level) => {
    const gains = level.newLevel - level.oldLevel;
    totalLevels += gains;
    fields.push({
      name: `${capatalize(level.skillName)} (${gains})`,
      value: `${level.emoji} From ${level.oldLevel} to ${
        level.newLevel === 99 ? `**${level.newLevel}**` : level.newLevel
      }!${level.newLevel == 99 ? ` ${level.compliment} ` : ""}`,
    });
  });

  const has99 = levelups.find((level) => level.newLevel == 99);

  if (has99) {
    Embed.setImage(has99.skillCape);
  }

  Embed.addFields(fields).setFooter({
    text: `Overall, ${capatalize(username)} gained an incredible total of (${totalLevels}) ${
      totalLevels > 1 ? "levels" : "level"
    }! Amazing job!🎉`,
    iconURL: getHighestLevel(levelups),
  });

  return Embed;
}

function getHighestLevel(levelups) {
  let highestCount = 0;
  let skillIcon = "";

  levelups.forEach((level) => {
    if (level.newLevel > highestCount) {
      highestCount = level.newLevel;
      skillIcon = level.skillIcon;
    }
  });
  return skillIcon;
}

function getHighestColor(levelups) {
  let highestCount = 0;
  let color = "";

  levelups.forEach((level) => {
    if (level.newLevel > highestCount) {
      highestCount = level.newLevel;
      color = level.skillColor;
    }
  });
  return color;
}
