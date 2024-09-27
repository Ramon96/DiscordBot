import { Command } from "@/structures/command";
import { OsrsSchema } from "@/models/osrs-schema";
import { handleHighscores } from "../util/runescape/handleHighscores";
import { handleWikiSync } from "../util/runescape/handleWikiSync";

new Command({
  name: "fetchhiscores",
  description: "Fetch all player's hiscores from OSRS",
  run: async ({ client }) => {
    const players = await OsrsSchema.find({});

    for (const player of players) {
      await handleHighscores(player, client).then(
        async () => await handleWikiSync(player, client)
      );
    }
  },
});
