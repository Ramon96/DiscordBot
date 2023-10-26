import { MessageEmbed, TextChannel } from "discord.js";
import { getStats } from "osrs-json-hiscores";
import osrs from "../../model/osrs";
import compare from "../../helpers/functions/compare";
import { isEmpty } from "lodash";
import osrsSkills from "../../helpers/osrs/skills";
import capatalize from "../../helpers/functions/capatalize";
import { Document } from "mongoose";

interface Player {
  id: string;
  osrsName: string;
  discordId: string;
  stats: Record<string, any>;
}

export const name = "highscore";
export const description =
  "fetches the highscores and compares the levels stored in the database with the highscore data. if there are level increases the player will be congratulated and the new data will be saved.";
export async function execute(
  channel: TextChannel,
  client: any
): Promise<void> {
  try {
    const docs = await osrs.find().exec();
    for (const doc of docs) {
      if (!doc.osrsName) continue;

      const res = await getStats(doc.osrsName);
      const changes = compare(doc.stats, res?.main?.skills ?? {});
      const username = doc.osrsName.replace(new RegExp("_", "g"), " ");
      const levelups: any[] = [];

      if (isEmpty(changes)) {
        console.log("no changes");
        continue;
      }

      for (const skill of Object.keys(changes).filter(
        (skill) =>
          skill !== "overall" && changes[skill]?.hasOwnProperty("level")
      )) {
        const player = await osrs.findOne({ _id: doc.id });
        if (player && doc.stats[skill]?.level < changes[skill]?.level) {
          levelups.push({
            skillName: skill,
            oldLevel: doc.stats[skill]?.level,
            newLevel: changes[skill]?.level,
            skillColor: osrsSkills[skill as keyof typeof osrsSkills]?.color,
            skillIcon:
              osrsSkills[skill as keyof typeof osrsSkills]?.placeholder,
            skillCape: osrsSkills[skill as keyof typeof osrsSkills]?.gif,
            emoji: osrsSkills[skill as keyof typeof osrsSkills]?.emoji,
            compliment:
              osrsSkills[skill as keyof typeof osrsSkills]?.compliment,
          });
          await updatePlayerStats(doc as Player, skill, changes[skill]);
        }
      }

      if (levelups.length > 0) {
        if (doc.discordId) {
          const embed = createEmbed(username, doc.discordId, levelups, client);
          await channel.send({ embeds: [embed] });
        } else {
          console.log(`No discordId found for player ${doc.osrsName}`);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

interface Player extends Document {
  id: string;
  osrsName: string;
  discordId: string;
  stats: Record<string, any>;
  markModified(path: string): void;
}

async function updatePlayerStats(
  player: Player,
  skill: string,
  newStats: any
): Promise<Player> {
  player.stats[skill] = newStats;
  player.markModified("stats");
  return await player.save();
}

function createEmbed(
  username: string,
  discordId: string,
  levelups: any[],
  client: any
): MessageEmbed {
  const guild = client.guilds.cache.get("867074325824012379");
  const user = guild.members.cache.get(discordId)?.user;

  const Embed = new MessageEmbed()
    .setTitle(`Congratulations, adventurer!`)
    .setDescription(
      `**${capatalize(
        username
      )}** has just completed an epic journey, and we're excited to share their accomplishments with you. Behold the amazing levels they've gained:`
    )
    .setAuthor({
      name: user?.username,
      iconURL: user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
        : undefined,
    })
    .setTimestamp()
    .setColor(getHighestColor(levelups) as any);

  let totalLevels = 0;
  let fields: any[] = [];

  levelups.forEach((level) => {
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
    text: `Overall, ${capatalize(
      username
    )} gained an incredible total of (${totalLevels}) ${
      totalLevels > 1 ? "levels" : "level"
    }! Amazing job!🎉`,
    iconURL: getHighestLevel(levelups),
  });

  return Embed;
}

function getHighestLevel(levelups: any[]): string {
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

function getHighestColor(levelups: any[]): string {
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
