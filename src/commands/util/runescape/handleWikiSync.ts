import { Client, ColorResolvable, EmbedBuilder, TextChannel } from "discord.js";
import { AchievementDiaries, IPlayer, MusicTracks, QuestProgress, Quests } from "../../../models/osrs-schema";
import { cleanUsername } from "../../../helpers/utils/cleanUsername";
import { startCase } from "lodash";
// import fetch from "node-fetch";
import { ExtendedClient } from "../../../structures/client";
import { WikiData } from "../../../typings/runescape";

export async function handleWikiSync(player: IPlayer, client: Client) {
  const url = `https://sync.runescape.wiki/runelite/player/${player.osrsName}/STANDARD`;

  const wikiData = (await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0'
    }
  })
      .then(async(res) => {
        if (!res.ok) {
          console.error(`HTTP error! Status: ${res.status}`);
          return null;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          try {
            const parseJson = JSON.parse(await res.text());
            if (parseJson.error) {
              console.error(`Error fetching wiki data: ${parseJson.error}`);
            }
            return parseJson;
          } catch (e) {
            console.error(`Error parsing JSON: ${e}`);
          }
          return null;
        }
        return res.json();
      })
      .catch((err) => {
        console.error(err);
        return undefined;
      })) as WikiData | undefined;
  
    if (!wikiData) {
        console.info(`${player.osrsName} not found on the wiki`);
        return;
      }

  if (!wikiData?.username) {
    console.info(`${player.osrsName} not found on the wiki`);
    return;
  }

  const questChanges = await checkQuests(player, wikiData.quests ?? {}, client);
  const diaryChanges = await checkAchievementDiaries(
    player,
    wikiData.achievement_diaries ?? {},
    client
  );
  const musicTrackChanges = await checkMusicTracks(
    player,
    wikiData.music_tracks ?? {},
    client
  );

  if (questChanges || diaryChanges || musicTrackChanges) {
    console.info(`Updated ${player.osrsName}'s wiki data`);

    player.quests = wikiData.quests;
    player.achievementDiaries = wikiData.achievement_diaries;
    player.musicTracks = wikiData.music_tracks;

    player.markModified("quests");
    player.markModified("achievementDiaries");
    player.markModified("musicTracks");
    await player.save();
    
    // Clear wikiData to free up memory
    wikiData.quests = {} as Quests;
    wikiData.achievement_diaries = {} as AchievementDiaries;
    wikiData.music_tracks = {} as MusicTracks;
  }
}

const checkAchievementDiaries = async (
  player: IPlayer,
  achievementDiaries: AchievementDiaries,
  client: Client
) => {
  let hasChanges = false;
  if (!achievementDiaries) return hasChanges;

  if (!player.achievementDiaries) {
    hasChanges = true;
    return hasChanges;
  }

  let diaryChanges = [];

  for (const region in achievementDiaries) {
    for (const diaryDifficulty in achievementDiaries[region]) {
      if (
        player.achievementDiaries[region][diaryDifficulty].complete !==
        achievementDiaries[region][diaryDifficulty].complete
      ) {
        // If the player has completed the diary, don't update it
        if (player.achievementDiaries[region][diaryDifficulty].complete) return;
        
        diaryChanges.push({
          region,
          diaryDifficulty,
        });
      }
    }
  }

  for (const diary of diaryChanges) {
    const diaryEmbed = await createDiaryEmbed(
      player.osrsName,
      diary.region,
      diary.diaryDifficulty,
      client as ExtendedClient,
      player.discordId
    );

    const channel = client.channels.cache.get(
      "872200569257873458"
    ) as TextChannel;

    if (!channel) console.log("Channel not found");

    if (diaryEmbed) {
      await channel.send({ embeds: [diaryEmbed] });
    }
  }

  if (diaryChanges.length > 0) {
    hasChanges = true;
  }

  return hasChanges;
};

const createDiaryEmbed = async (
  username: string,
  region: string,
  difficulty: string,
  client: ExtendedClient,
  discordId: string
) => {
  const user = await client.users.fetch(discordId);

  return new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
      })
      .setTitle(`${cleanUsername(username)}`)
      .setDescription(
          `📖 Has completed the ${region} **${startCase(difficulty)} diaries**.`
      )
      .setColor("#3cab3c");
};

const checkQuests = async (player: IPlayer, quests: Quests, client: Client) => {
  let hasChanges = false;

  if (!quests) return hasChanges;

  if (!player.quests) {
    hasChanges = true;
    return hasChanges;
  }

  let questChanges = [];

  for (const quest in quests) {
    if (player.quests[quest] !== quests[quest]) {
      // If the player has completed the quest, don't update it
      if(player.quests[quest] === QuestProgress.COMPLETED) return;
      // If the player has started the quest and the wiki has it as not started, don't update it
      if(player.quests[quest] === QuestProgress.IN_PROGRESS && quests[quest] === QuestProgress.NOT_STARTED) return;
      
      questChanges.push(quest);
    }
  }

  for (const quest of questChanges) {
    const questEmbed = await createQuestEmbed(
      player.osrsName,
      quest,
      quests[quest],
      client as ExtendedClient,
      player.discordId
    );

    const channel = client.channels.cache.get(
      "872200569257873458"
    ) as TextChannel;

    if (!channel) console.log("Channel not found");

    if (questEmbed) {
      await channel.send({ embeds: [questEmbed] });
    }
  }

  if (questChanges.length > 0) {
    hasChanges = true;
    return hasChanges;
  }
};

const createQuestEmbed = async (
  username: string,
  questName: string,
  questProgress: QuestProgress,
  client: ExtendedClient,
  discordId: string
) => {
  if (questProgress === QuestProgress.NOT_STARTED) return;

  const user = await client.users.fetch(discordId);

  let title = "";
  let color = "";

  if (questProgress === QuestProgress.IN_PROGRESS) {
    title = `Has started the quest **${questName}**.`;
    color = "#ffff00";
  } else {
    title = `Has completed the quest **${questName}!**`;
    color = "#4344e6";
  }

  return new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
      })
      .setTitle(`${cleanUsername(username)}`)
      .setDescription(`🧭 ${title}`)
      .setColor(color as ColorResolvable);
};

const checkMusicTracks = async (
  player: IPlayer,
  musicTracks: MusicTracks,
  client: Client
) => {
  let hasChanges = false;

  if (!musicTracks) return hasChanges;

  if (!player.musicTracks) {
    hasChanges = true;
    return hasChanges;
  }

  let musicTrackChanges = [];

  for (const track in musicTracks) {
    if (player.musicTracks[track] !== musicTracks[track]) {
      // If the player has unlocked the track, don't update it
      if(player.musicTracks[track]) return;
      
      musicTrackChanges.push(track);
    }
  }

  for (const track of musicTrackChanges) {
    const musicTrackEmbed = await createMusicTrackEmbed(
      player.osrsName,
      track,
      client as ExtendedClient,
      player.discordId
    );

    const channel = client.channels.cache.get(
      "872200569257873458"
    ) as TextChannel;

    if (!channel) console.log("Channel not found");

    if (musicTrackEmbed) {
      await channel.send({ embeds: [musicTrackEmbed] });
    }
  }

  if (musicTrackChanges.length > 0) {
    hasChanges = true;
    return hasChanges;
  }
};

const createMusicTrackEmbed = async (
  username: string,
  track: string,
  client: ExtendedClient,
  discordId: string
) => {
  const user = await client.users.fetch(discordId);

  return new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
      })
      .setTitle(`${cleanUsername(username)}`)
      .setDescription(`🎵 Unlocked the music track **${track}**.`)
      .setColor("#000000");
};
