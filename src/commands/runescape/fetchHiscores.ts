import { Command } from "@/structures/command";
import { OsrsSchema } from "@/models/osrs-schema";
import { handleSkills, handleBosses, handleWikiSync, fetchPlayerHiscores } from "@/commands/util/runescape";

export default new Command({
  name: "fetchhiscores",
  description: "Fetch all player's hiscores from OSRS",
  run: async ({ client }) => {
    const players = await OsrsSchema.find({});
    
    if(!players) return console.log("No players found");
    const fetchedStats = await fetchPlayerHiscores(players);
    
    await handleBosses(players, client, fetchedStats);

    for (const player of players) {
        const playerStats = fetchedStats.find((stats) => stats.hasOwnProperty(player.osrsName))?.[player.osrsName];
      
        await handleSkills(player, client, playerStats);
        await handleWikiSync(player, client);
    }
  },
});
