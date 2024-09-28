import mongoose, { Document } from "mongoose";
import { Bosses, Skills } from "osrs-json-hiscores";

const osrsSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  osrsName: { type: String, required: true },
  stats: { type: Object, required: false },
  bosses: { type: Object, required: false },
  quests: { type: Object, required: false },
  achievementDiaries: { type: Object, required: false },
  musicTracks: { type: Object, required: false },
});

export interface IPlayer extends Document {
  discordId: string;
  osrsName: string;
  stats?: Skills;
  bosses?: Bosses;
  quests?: Quests;
  achievementDiaries?: AchievementDiaries;
  musicTracks?: MusicTracks;
}

interface DiaryDifficulty {
  complete: boolean;
  tasks: boolean[];
}

interface Diary {
  [key: string]: DiaryDifficulty;
}

export interface AchievementDiaries {
  [key: string]: Diary;
}

export interface Quests {
  [key: string]: QuestProgress;
}

export enum QuestProgress {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
}

export interface MusicTracks {
  [key: string]: boolean;
}

export const OsrsSchema = mongoose.model<IPlayer>("Player", osrsSchema);
