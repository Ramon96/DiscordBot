import { Command } from "@/structures/command";
import { OsrsSchema } from "@/models/osrs-schema";
import { handleHiscores } from "@/commands/util/runescape/handleHiscores";
import { handleWikiSync } from "@/commands/util/runescape/handleWikiSync";
import { handleBosses } from "@/commands/util/runescape/handleBosses";
import { fetchPlayerHiscores } from "@/commands/util/runescape/fetchPlayerHiscores";

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
      
        await handleHiscores(player, client, playerStats);
        await handleWikiSync(player, client);
    }
  },
});
