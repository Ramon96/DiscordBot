import { Command } from "../../structures/command";
import { OsrsSchema } from "../../models/osrs-schema";
import hiscores from "osrs-json-hiscores";
import { compare } from "../../helpers/utils/compare";
import { EmbedBuilder, TextChannel } from "discord.js";
import { capitalize, isEmpty } from "lodash";
import { osrsSkills } from "../../helpers/osrs/skills";
import { ExtendedClient } from "../../structures/client";

type GainedLevel = {
  skill: string;
  oldLevel: number;
  newLevel: number;
};

export default new Command({
  name: "fetchhiscores",
  description: "Fetch all player's hiscores from oldschool runescape",
  run: async ({ client }) => {
    const players = await OsrsSchema.find({});

    for (const player of players) {
      const playerStats = await hiscores
        .getStats(player.osrsName)
        .catch((err) => {
          return null;
        });

      if (!playerStats) {
        console.info(`${player.osrsName} not found on hiscores`);
        continue;
      }

      const changes = compare(player.stats, playerStats.main.skills) as object;
      const username = player.osrsName.replace(new RegExp("_", "g"), " ");
      const currentStats = player.stats;
      let hasLevelGains = false;
      let gainedLevels: GainedLevel[] = [];

      if (isEmpty(changes)) return console.log(`${username} has no changes`);

      for (const skill of Object.keys(changes).filter((skill) =>
        changes[skill].hasOwnProperty("level")
      )) {
        if (playerStats.main.skills[skill].level > currentStats[skill].level) {
          gainedLevels.push({
            skill,
            oldLevel: currentStats[skill].level,
            newLevel: playerStats.main.skills[skill].level,
          });
          hasLevelGains = true;
        }
      }

      if (!hasLevelGains) {
        continue;
      }

      const embed = await createEmbed(
        username,
        player.discordId,
        gainedLevels,
        client
      );
      const channel = client.channels.cache.get(
        "872200569257873458"
      ) as TextChannel;

      if (!channel) return console.log("Channel not found");

      channel.send({ embeds: [embed] });

      player.stats = playerStats.main.skills;
      player.markModified("stats");
      await player.save();
      console.info(`Updated ${player.osrsName}'s stats`);
    }
  },
});

type Field = {
  name: string;
  value: string;
};

const createEmbed = async (
  username: string,
  discordId: string,
  gainedLevels: GainedLevel[],
  client: ExtendedClient
) => {
  const user = await client.users.fetch(discordId);
  let totalLevels = 0;
  let fields: Field[] = [];

  let highestLevelSkill = {
    name: "",
    level: 0,
  };

  gainedLevels.map((level) => {
    const levelDifference = level.newLevel - level.oldLevel;
    if (levelDifference === 0 || level.skill === "overall") return;

    totalLevels += levelDifference;

    if (level.newLevel == 99) {
      embed.setImage(osrsSkills[level.skill].gif);
    }

    if (highestLevelSkill.level < level.newLevel) {
      highestLevelSkill = {
        name: level.skill,
        level: level.newLevel,
      };
    }

    fields.push({
      name: `${capitalize(level.skill)} (${level.newLevel - level.oldLevel})`,
      value: `${osrsSkills[level.skill].emoji} from ${level.oldLevel} to ${
        level.newLevel
      }! ${level.newLevel === 99 ? osrsSkills[level.skill].compliment : ""}`,
    });
  });

  const embed = new EmbedBuilder()
    .setTitle(`Congratulations to ${username}!`)
    .setDescription(
      `**${capitalize(
        username
      )}** has just completed an epic journey, and we're excited to share their accomplishments with you. Behold the amazing levels they've gained:`
    )
    .setAuthor({
      name: user.username,
      iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
    })
    .setTimestamp()
    .setColor(
      osrsSkills[highestLevelSkill.name]?.color ?? osrsSkills.overall.color
    );

  // sort fields so that overall is always at the bottom
  fields = fields.sort((a, b) => {
    if (a.name === "Overall") return 1;
    if (b.name === "Overall") return -1;
    return 0;
  });

  const overallLevel = gainedLevels.find((level) => level.skill === "overall");

  embed
    .addFields(fields)
    .addFields({
      name: "Total Level",
      value: `${osrsSkills.overall.emoji} ${overallLevel.newLevel}`,
    })
    .setFooter({
      text: `Overall, ${capitalize(
        username
      )} gained an incredible total of (${totalLevels}) ${
        totalLevels > 1 ? "levels" : "level"
      }! Amazing job!🎉`,
      iconURL:
        osrsSkills[highestLevelSkill.name]?.placeholder ??
        osrsSkills.overall.placeholder,
    });

  return embed;
};
