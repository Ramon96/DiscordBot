import { Command } from "../../structures/command";
import { ApplicationCommandOptionType } from "discord.js";
import { WikiData } from "../util/runescape/handleWikiSync";
import fetch from "node-fetch";

export default new Command({
  name: "questsosrs",
  description: "shows the quests of a user",
  options: [
    {
      name: "rsn",
      description: "The Runescape name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ interaction, args }) => {
    if (!interaction) return;
    if (!args) return interaction.followUp("Please provide a valid rsn");

    const rsn = args.getString("rsn");

    if (!rsn) return interaction.followUp("No rsn found");

    const url = `https://sync.runescape.wiki/runelite/player/${rsn}/STANDARD`;

    const wikiData = (await fetch(url)
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      })) as WikiData | null;

    if (!wikiData) {
      return interaction.followUp(
        "User not found on the wiki, make sure you have wiki sync enabled"
      );
    }

    const notStarted = [];
    const inProgress = [];
    const completed = [];

    for (const questName in wikiData.quests) {
      if (wikiData.quests.hasOwnProperty(questName)) {
        const questStatus = wikiData.quests[questName];
        if (questStatus === 0) {
          notStarted.push(questName);
        } else if (questStatus === 1) {
          inProgress.push(questName);
        } else if (questStatus === 2) {
          completed.push(questName);
        }
      }
    }

    return interaction.followUp(`
       🧭 ${rsn}'s Quest list\n\n
        **Completed**\n
        ${completed.join("\n")}\n\n
        **In Progress**\n
        ${inProgress.join("\n")}\n\n
        **Not Started**\n
        ${notStarted.join("\n")}
      `);
  },
});
