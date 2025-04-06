import { Stats } from "osrs-json-hiscores";
import {AchievementDiaries, MusicTracks, Quests} from "../../models/osrs-schema";
import {Boss} from "osrs-json-hiscores/lib/types";

export type GainedLevel = {
    skillName: string;
    storedLevel: number;
    fetchedLevel: number;
};
 
export type Field = {
    name: string;
    value: string;
};

 export type Skills = {
     [key: string]: {
         gif: string;
         color: number;
         placeholder: string;
         emoji: string;
         compliment: string;
     };
 };
 
 export type Bosses = {
        [Type in Boss]: {
            img: string;
            emoji: string;
            message: string;
        };
 };
 
 export type FetchStats = {
        [key: string]: Stats;
 };

export type WikiData = {
    username?: string;
    quests?: Quests;
    achievement_diaries?: AchievementDiaries;
    music_tracks?: MusicTracks;
};