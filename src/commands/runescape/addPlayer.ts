import { ApplicationCommandOptionType } from "discord.js";

import hiscores, { Skills } from "osrs-json-hiscores";
import { Command } from "../../structures/command";
import { OsrsSchema } from "../../models/osrs-schema";
import { WikiData } from "../../typings/runescape";
import fetch from "node-fetch";



export default new Command({
    name: "addplayer",
    description: "add a player to the database",
    options: [
        {
            name: "osrs_name",
            description: "your osrs name",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "discord_user",
            description: "your discord user",
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],
    run: async({interaction, args}) => {
        if (!interaction) return;

        if (!args)
            return interaction.followUp(
                "Please provide both your osrs name and discord user"
            );

        const osrsName = args.getString("osrs_name");
        const discordUser = args.getUser("discord_user");

        if (!discordUser || !osrsName) {
            return interaction.followUp("Please provide a valid discord and osrs user");
        }

        if (
            await OsrsSchema.exists({discordId: discordUser.id, osrsName: osrsName})
        ) {
            return interaction.followUp("You are already in the database");
        }


        const playerStats = await checkHiscores(osrsName);
        const wikiData = await checkWikiSync(osrsName);
        
        if (!playerStats || !wikiData?.username) {
            return interaction.followUp("osrs name not found on hiscores or on wiki sync");
        }
        
        const player = new OsrsSchema({
            discordId: discordUser.id,
            osrsName,
            stats: playerStats,
            quests: wikiData.quests,
            achievementDiaries: wikiData.achievement_diaries,
            musicTracks: wikiData.music_tracks,
        });
        
        await player.save();
        await interaction.followUp(`${osrsName} has been added to the database`);
    },
});

const checkHiscores = async(osrsName: string): Promise<Skills | undefined> => {
    return await hiscores.getStats(osrsName)
        .then((playerStats) => {
            return playerStats.main?.skills;
        })
        .catch((err) => {
            console.error(err);
            return undefined;
        });
}

const checkWikiSync = async(osrsName: string): Promise<WikiData | undefined> => {
    const url = `https://sync.runescape.wiki/runelite/player/${osrsName}/STANDARD`;

    return (await fetch(url)
        .then(async(res) => {
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
            return res.json()
        })
        .catch((err) => {
            console.error(err);
            return undefined;
        })) as WikiData | undefined;
}
