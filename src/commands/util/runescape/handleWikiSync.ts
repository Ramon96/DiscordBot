import { Client, TextChannel, EmbedBuilder, ColorResolvable } from "discord.js";
import {
  AchievementDiaries,
  IPlayer,
  Quests,
  MusicTracks,
  QuestProgress,
} from "../../../models/osrs-schema";
import { ExtendedClient } from "@/structures/client";
import { cleanUsername } from "../../../helpers/utils/cleanUsername";
import { startCase } from "lodash";
import fetch from "node-fetch";

export type WikiData = {
  quests: Quests;
  achievement_diaries: AchievementDiaries;
  music_tracks: MusicTracks;
};

export async function handleWikiSync(player: IPlayer, client: Client) {
  const url = `https://sync.runescape.wiki/runelite/player/${player.osrsName}/STANDARD`;

  const wikiData = (await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    })) as WikiData | null;

  if (!wikiData) {
    console.info(`${player.osrsName} not found on the wiki`);
    return;
  }

  const questChanges = await checkQuests(player, wikiData.quests, client);
  const diaryChanges = await checkAchievementDiaries(
    player,
    wikiData.achievement_diaries,
    client
  );
  const musicTrackChanges = await checkMusicTracks(
    player,
    wikiData.music_tracks,
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
    for (const diffeculty in achievementDiaries[region]) {
      if (
        player.achievementDiaries[region][diffeculty].complete !==
        achievementDiaries[region][diffeculty].complete
      ) {
        diaryChanges.push({
          region,
          diffeculty,
        });
      }
    }
  }

  diaryChanges.forEach(async (diary) => {
    const diaryEmbed = await createDiaryEmbed(
      player.osrsName,
      diary.region,
      diary.diffeculty,
      client as ExtendedClient,
      player.discordId
    );

    const channel = client.channels.cache.get(
      "872200569257873458"
    ) as TextChannel;

    if (!channel) return console.log("Channel not found");

    if (diaryEmbed) {
      channel.send({ embeds: [diaryEmbed] });
    }
  });

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

  const embed = new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
    })
    .setTitle(`${cleanUsername(username)}`)
    .setDescription(
      `📖 Has completed the ${region} **${startCase(difficulty)} diaries**.`
    )
    .setColor("#3cab3c");

  return embed;
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
      questChanges.push(quest);
    }
  }

  questChanges.forEach(async (quest) => {
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

    if (!channel) return console.log("Channel not found");

    if (questEmbed) {
      channel.send({ embeds: [questEmbed] });
    }
  });

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

  const embed = new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
    })
    .setTitle(`${cleanUsername(username)}`)
    .setDescription(`🧭 ${title}`)
    .setColor(color as ColorResolvable);

  return embed;
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
      musicTrackChanges.push(track);
    }
  }

  musicTrackChanges.forEach(async (track) => {
    const musicTrackEmbed = await createMusicTrackEmbed(
      player.osrsName,
      track,
      client as ExtendedClient,
      player.discordId
    );

    const channel = client.channels.cache.get(
      "872200569257873458"
    ) as TextChannel;

    if (!channel) return console.log("Channel not found");

    if (musicTrackEmbed) {
      channel.send({ embeds: [musicTrackEmbed] });
    }
  });

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

  const embed = new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`,
    })
    .setTitle(`${cleanUsername(username)}`)
    .setDescription(`🎵 Unlocked the music track **${track}**.`)
    .setColor("#000000");

  return embed;
};
