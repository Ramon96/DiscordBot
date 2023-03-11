const { MessageEmbed } = require("discord.js");
const hiscores = require("osrs-json-hiscores");
const Player = require("../../model/osrs");
const compare = require("../../helpers/functions/compare");
const _ = require("lodash");
const osrsSkills = require("../../helpers/osrs/skills");

module.exports = {
  name: "highscore",
  description:
    "fetches the highscores and compares the levels stored in the database with the highscore data. if there are level increases the player will be congratiolated and the new data will be saved.",
  execute(channel) {
    Player.find()
      .exec()
      .then((docs) => {
        Object.keys(docs).forEach(async function (item) {
          try {
            await hiscores.getStats(docs[item].osrsName).then(async (res) => {
              const changes = compare(docs[item].stats, res.main.skills);
              const username = docs[item].osrsName.replace(new RegExp("_", "g"), " ");
              const levelups = [];

              if (_.isEmpty(changes)) {
                console.log("no changes");
                return;
              }

              Object.keys(changes)
                .filter((skill) => skill !== "overall" && changes[skill].hasOwnProperty("level"))
                .forEach(async (skill) => {
                  const player = await Player.findOne({ _id: docs[item].id });
                  if (docs[item].stats[skill].level < changes[skill].level) {
                    levelups.push({
                      skillName: skill,
                      oldLevel: docs[item].stats[skill].level,
                      newLevel: changes[skill].level,
                      skillColor: osrsSkills[skill].color,
                      skillIcon: osrsSkills[skill].placeholder,
                      skillCape: osrsSkills[skill].gif,
                    });
                    updatePlayerStats(player, skill, changes[skill]);
                  }
                })
                .then(async () => {
                  if (levelups.length > 0) {
                    const embed = createEmbed(username, docs[item].discordId, levelups);
                    await channel.send({ embeds: [embed] });
                  }
                });
            });
          } catch (err) {
            console.log(err);
          }
        });
      })
      .catch((err) => console.log(err));
  },
};

function updatePlayerStats(player, skill, newStats) {
  player.stats[skill] = newStats;
  player.markModified("stats");
  return player.save();
}

function createEmbed(username, discordId, levelups) {
  const Embed = new MessageEmbed()
    .setTitle(`**${_.startCase(username)} has just ended it's journey.`)
    .setDescription(
      levelups.length > 1
        ? `During this journey the following levels where gained:`
        : `During this journey the following level was gained:`
    )
    .setTimestamp()
    .setFooter({
      text: `Congratulations <@${discordId}>, keep the gains comming.`,
      iconURL: getHighestLevel(levelups),
    })
    .setColor(getHighestColor(levelups));

  let totalLevels = 0;
  let fields = [];

  levelups.map((level) => {
    const gains = level.newLevel - level.oldLevel;
    totalLevels += gains;
    fields.push({
      name: `${level.skillName} (${gains})`,
      value: `${level.oldLevel} => ${level.newLevel === 99 ? `**${level.newLevel}**` : level.newLevel}`,
    });
  });

  const has99 = levelups.find((level) => level.newLevel == 99);

  if (has99) {
    Embed.setImage(has99.skillCape);
  }

  Embed.addFields(fields);
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
