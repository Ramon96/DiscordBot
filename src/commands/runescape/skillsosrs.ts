import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/command";
import hiscores from "osrs-json-hiscores";
import { osrsSkills } from "../../helpers/osrs/skills";
import { capitalize } from "lodash";

export default new Command({
  name: "skillsosrs",
  description: "shows the skills of a user",
  options: [
    {
      name: "rsn",
      description: "The Runescape name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ interaction, args }) => {
    const rsn = args.getString("rsn");

    if (!rsn) interaction.followUp("No rsn found");

    let stats;

    await hiscores
      .getStats(rsn)
      .then((res) => {
        stats = res;
      })
      .catch((err) => {
        interaction.followUp("User not found on hiscores");
      });

    if (!stats) interaction.followUp("User not found on hiscores");

    const embed = new EmbedBuilder();
    embed.setAuthor({
      name: `${capitalize(rsn)}`,
      iconURL:
        "https://preview.redd.it/whan5oux4vpz.png?width=960&crop=smart&auto=webp&s=60c6b6df01af710bdb536c34d9d5f5142bf03a8e",
    });
    embed.setTitle(`Stats:`);
    embed.setFooter({
      text: `Total Level: ${stats.main.skills.overall.level}`,
    });
    embed.setThumbnail("https://i.imgur.com/oImaKtY.png");

    for (const skill of Object.keys(stats.main.skills).filter(
      (skill) => skill !== "overall"
    )) {
      embed.addFields({
        name: osrsSkills[skill].emoji,
        value: `${stats.main.skills[skill].level}`,
        inline: true,
      });
    }

    embed.addFields({
      name: "Clue Scrolls",
      value: `**All**:${stats.main.clues.all.score}
      **Beginner**: ${stats.main.clues.beginner.score}
      **Easy**: ${stats.main.clues.easy.score}
      **Medium**: ${stats.main.clues.medium.score}
      **Hard**: ${stats.main.clues.hard.score}
      **Elite**: ${stats.main.clues.elite.score}
      **Master**: ${stats.main.clues.master.score}`,
      inline: false,
    });

    interaction.followUp({ embeds: [embed] });
  },
});
