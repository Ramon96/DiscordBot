import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { IPlayer } from "../../../models/osrs-schema";
import { FetchStats, Field } from "../../../typings/runescape";
import { cleanUsername } from "../../../helpers/utils/cleanUsername";
import { osrsBosses } from "../../../helpers/osrs/bosses";
import { Boss, Bosses } from "osrs-json-hiscores";

type Player = { name: string; kc: number; total: number };

export async function handleBosses(
  players: IPlayer[],
  client: Client,
  hiscoreStats: FetchStats[]
) {
  let killedBosses: {
    bossName: string;
    players: Player[];
  }[] = [];

  for (const player of players) {
    const fetchedStats = hiscoreStats.find((stats) =>
      stats.hasOwnProperty(player.osrsName)
    )?.[player.osrsName];

    if (!fetchedStats) {
      console.info(`${player.osrsName} not found on hiscores`);
      continue;
    }

    if (!fetchedStats.bosses) {
      console.info(`${player.osrsName} has no boss kc`);
      continue;
    }

    if (!player.bosses) {
      player.bosses = fetchedStats.bosses;
      player.markModified("bosses");
      await player.save();
      console.info(`Added ${player.osrsName}'s bosses to the database`);
      continue;
    }

    const storedStats = player.bosses;

    let changes: { boss: string; kc: number; total: number }[] = [];
    for (const [key, _] of Object.entries(fetchedStats.bosses)) {
      const bossKey = key as keyof typeof storedStats;
      const storedBossKc = storedStats[bossKey]?.score ?? 0;
      const fetchedBossKc = fetchedStats.bosses[bossKey]?.score ?? 0;

      if (fetchedBossKc > storedBossKc) {
        changes.push({
          boss: bossKey,
          kc: fetchedBossKc - storedBossKc,
          total: fetchedBossKc,
        });
      }
    }

    if (changes.length === 0) {
      console.log(`${player.osrsName} has no changes`);
      continue;
    }

    for (const change of changes) {
      const boss = change.boss;
      const kc = change.kc;

      const bossIndex = killedBosses.findIndex((b) => b.bossName === boss);

      if (bossIndex === -1) {
        killedBosses.push({
          bossName: boss,
          players: [
            { name: cleanUsername(player.osrsName), kc, total: change.total },
          ],
        });
      } else {
        killedBosses[bossIndex].players.push({
          name: cleanUsername(player.osrsName),
          kc,
          total: change.total,
        });
      }
    }

    player.bosses = fetchedStats.bosses;
    player.markModified("bosses");
    await player.save();

    // Clear fetchedStats to free up memory
    fetchedStats.bosses = {} as Bosses;
  }

  if (killedBosses.length === 0) {
    console.info("No players have killed bosses");
    return;
  }

  killedBosses.map(async (boss) => {
    if (boss.players.length === 0) return;

    const channel = client.channels.cache.get(
      "872200569257873458"
    ) as TextChannel;

    if (!channel) return console.log("Channel not found");

    const embed = await createBossEmbed(boss);

    await channel.send({ embeds: [embed] });
  });

  // Clear killedBosses to free up memory
  killedBosses.length = 0;
}

const createBossEmbed = async (boss: {
  bossName: string;
  players: Player[];
}) => {
  const { bossName, players } = boss as {
    bossName: Boss;
    players: Player[];
  };
  const cleanedBossName = cleanUsername(bossName);
  let fields: Field[] = [];
  let nameList = "";
  let subject = players.length === 1 ? "has" : "have";

  players.map((player) => {
    if (players.length === 1) {
      nameList = player.name;
    } else {
      nameList = players.map((p) => p.name).join(", ");
      nameList = nameList.replace(/,([^,]*)$/, " and$1");
    }

    fields.push({
      name: player.name,
      value: player.total.toString() + ` (+${player.kc})`,
    });
  });
  let message = `**${nameList}** ${subject} been on an expedition and killed **${cleanedBossName}**`;

  // Sort the fields by total
  fields = fields.sort((a, b) => {
    const totalA = parseInt(a.value.split(" ")[0]);
    const totalB = parseInt(b.value.split(" ")[0]);

    return totalB - totalA;
  });

  const embed = new EmbedBuilder()
    .setTitle(cleanedBossName)
    .setDescription(message)
    .addFields(fields)
    .setTimestamp();

  if (osrsBosses[bossName]) {
    message = `**${nameList}** ${subject} ${osrsBosses[bossName].message}`;
    embed.setDescription(message);
    embed.setImage(osrsBosses[bossName].img);
    embed.setFooter({ text: osrsBosses[bossName].emoji });
  }

  return embed;
};
