import { Client, TextChannel, EmbedBuilder } from "discord.js";

import { Skills, Stats } from "osrs-json-hiscores";
import { capitalize, isEmpty } from "lodash";
import { IPlayer } from "../../../models/osrs-schema";
import { compare } from "../../../helpers/utils/compare";
import { cleanUsername } from "../../../helpers/utils/cleanUsername";
import { Field, GainedLevel } from "../../../typings/runescape";
import { ExtendedClient } from "../../../structures/client";
import { osrsSkills } from "../../../helpers/osrs/skills";

export async function handleSkills(
  player: IPlayer,
  client: Client,
  HiscoreStats: Stats | undefined
) {
  const fetchedStats = HiscoreStats?.skills;

  if (!fetchedStats) {
    console.info(`${player.osrsName} not found on hiscores`);
    return;
  }

  if (!player.stats) {
    player.stats = fetchedStats;
    player.markModified("stats");
    await player.save();
    console.info(`Added ${player.osrsName}'s stats to the database`);
    return;
  }

  const storedStats = player.stats;
  const changes = compare(fetchedStats, storedStats);

  const username = cleanUsername(player.osrsName);
  if (isEmpty(changes)) return console.log(`${username} has no changes`);

  let hasLevelGains = false;
  let gainedLevels: GainedLevel[] = [];

  const filteredSkills = Object.keys(changes).filter((skill) =>
    changes[skill].hasOwnProperty("level")
  );

  for (const skill of filteredSkills) {
    const skillKey = skill as keyof Skills;

    const storedLevel = storedStats[skillKey]?.level || 1;
    const fetchedLevel = fetchedStats[skillKey].level;

    if (fetchedLevel > storedLevel) {
      gainedLevels.push({
        skillName: skill,
        storedLevel: storedLevel,
        fetchedLevel: fetchedLevel,
      });
      hasLevelGains = true;
    }
  }

  if (!hasLevelGains) {
    return;
  }
  try {
    player.stats = fetchedStats;
    player.markModified("stats");
    await player.save();

    const channel = client.channels.cache.get(
      "872200569257873458"
    ) as TextChannel;

    if (!channel) return console.log("Channel not found");

    const embed = await createEmbed(
      username,
      player.discordId,
      gainedLevels,
      client as ExtendedClient
    );

    await channel.send({ embeds: [embed] });

    console.info(`Updated ${player.osrsName}'s stats`);
  } catch (error) {
    console.error(`Failed to update ${player.osrsName}'s stats:`, error);
  } finally {
    // Clear fetchedStats to free up memory
    Object.keys(fetchedStats).forEach((key) => {
      fetchedStats[key as keyof Skills] = { level: 0, xp: 0, rank: 0 };
    });
    console.log(`Cleaned up fetchedStats for ${player.osrsName}`);
  }
}

const createEmbed = async (
  username: string,
  discordId: string,
  gainedLevels: GainedLevel[],
  client: ExtendedClient
) => {
  const user = await client.users.fetch(discordId);
  let totalLevels: number = 0;
  let fields: Field[] = [];

  let highestLevelSkill: {
    name: string;
    level: number;
  } = {
    name: "",
    level: 0,
  };

  // TODO: replace description with a ai generated message
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
    .setTimestamp();

  // sort fields so that overall is always at the bottom
  fields = fields.sort((a, b) => {
    if (a.name === "Overall") return 1;
    if (b.name === "Overall") return -1;
    return 0;
  });

  gainedLevels.map((skill) => {
    const levelDifference = skill.fetchedLevel - skill.storedLevel;
    if (levelDifference === 0 || skill.skillName === "overall") return;

    totalLevels += levelDifference;

    if (skill.fetchedLevel == 99) {
      embed.setImage(osrsSkills[skill.skillName].gif);
    }

    if (highestLevelSkill.level < skill.fetchedLevel) {
      highestLevelSkill = {
        name: skill.skillName,
        level: skill.fetchedLevel,
      };
    }

    fields.push({
      name: `${capitalize(skill.skillName)} (${
        skill.fetchedLevel - skill.storedLevel
      })`,
      value: `${osrsSkills[skill.skillName].emoji} from ${
        skill.storedLevel
      } to ${skill.fetchedLevel}! ${
        skill.fetchedLevel === 99 ? osrsSkills[skill.skillName].compliment : ""
      }`,
    });
  });

  const overallLevel = gainedLevels.find(
    (skill) => skill.skillName === "overall"
  );

  embed
    .addFields(fields)
    .addFields({
      name: "Total Level",
      value: `${osrsSkills.overall.emoji} ${overallLevel?.fetchedLevel}`,
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
    })
    .setColor(
      osrsSkills[highestLevelSkill.name]?.color ?? osrsSkills.overall.color
    );

  return embed;
};
