import { Command } from "../../structures/command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { WikiData } from "../util/runescape/handleWikiSync";
import { capitalize } from "lodash";
import { AchievementDiaries } from "@/models/osrs-schema";
import fetch from "node-fetch";

export default new Command({
  name: "diarysosrs",
  description: "shows the diaries of a user",
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

    const diaries = wikiData.achievement_diaries;

    const embed = await createEmbed(rsn, diaries);
    return interaction.followUp({ embeds: [embed] });
  },
});

const createEmbed = async (rsn: string, diaries: AchievementDiaries) => {
  const embed = new EmbedBuilder();
  embed.setAuthor({
    name: `${capitalize(rsn)}`,
    iconURL:
      "https://preview.redd.it/whan5oux4vpz.png?width=960&crop=smart&auto=webp&s=60c6b6df01af710bdb536c34d9d5f5142bf03a8e",
  });

  embed.setThumbnail(
    "https://oldschool.runescape.wiki/images/thumb/Achievement_Diaries.png/130px-Achievement_Diaries.png?f3803"
  );

  for (const region in diaries) {
    let values = [];

    values.push(`${diaries[region]["Easy"].complete ? "✅" : "❌"} - Easy`);
    values.push(`${diaries[region]["Medium"].complete ? "✅" : "❌"} - Medium`);
    values.push(`${diaries[region]["Hard"].complete ? "✅" : "❌"} - Hard`);
    values.push(`${diaries[region]["Elite"].complete ? "✅" : "❌"} - Elite`);

    embed.addFields({
      name: region,
      value: values.join("\n"),
      inline: true,
    });
  }

  return embed;
};
