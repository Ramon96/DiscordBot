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

    if (!rsn) return interaction.followUp("No rsn found");

    let stats;

    await hiscores
      .getStats(rsn)
      .then((res) => {
        stats = res;
      })
      .catch((err) => {
        return interaction.followUp("User not found on hiscores");
      });

    if (!stats) return interaction.followUp("User not found on hiscores");

    const embed = new EmbedBuilder();
    embed.setAuthor({
      name: `${capitalize(rsn)}`,
      iconURL:
        "https://preview.redd.it/whan5oux4vpz.png?width=960&crop=smart&auto=webp&s=60c6b6df01af710bdb536c34d9d5f5142bf03a8e",
    });

    embed.setFooter({
      text: `Total Level: ${stats.main.skills.overall.level}`,
    });
    embed.setThumbnail("https://i.imgur.com/oImaKtY.png");

    embed.addFields({
      name: osrsSkills.attack.emoji,
      value: `${stats.main.skills.attack.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.hitpoints.emoji,
      value: `${stats.main.skills.hitpoints.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.mining.emoji,
      value: `${stats.main.skills.mining.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.strength.emoji,
      value: `${stats.main.skills.strength.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.agility.emoji,
      value: `${stats.main.skills.agility.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.smithing.emoji,
      value: `${stats.main.skills.smithing.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.defence.emoji,
      value: `${stats.main.skills.defence.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.herblore.emoji,
      value: `${stats.main.skills.herblore.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.fishing.emoji,
      value: `${stats.main.skills.fishing.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.ranged.emoji,
      value: `${stats.main.skills.ranged.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.thieving.emoji,
      value: `${stats.main.skills.thieving.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.cooking.emoji,
      value: `${stats.main.skills.cooking.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.prayer.emoji,
      value: `${stats.main.skills.prayer.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.crafting.emoji,
      value: `${stats.main.skills.crafting.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.firemaking.emoji,
      value: `${stats.main.skills.firemaking.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.magic.emoji,
      value: `${stats.main.skills.magic.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.fletching.emoji,
      value: `${stats.main.skills.fletching.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.woodcutting.emoji,
      value: `${stats.main.skills.woodcutting.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.runecraft.emoji,
      value: `${stats.main.skills.runecraft.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.slayer.emoji,
      value: `${stats.main.skills.slayer.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.farming.emoji,
      value: `${stats.main.skills.farming.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.construction.emoji,
      value: `${stats.main.skills.construction.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.hunter.emoji,
      value: `${stats.main.skills.hunter.level}`,
      inline: true,
    });

    embed.addFields({
      name: osrsSkills.overall.emoji,
      value: `${stats.main.skills.overall.level}`,
      inline: true,
    });

    embed.addFields({
      name: "Clue Scrolls",
      value: `All:${stats.main.clues.all.score}
      Beginner: ${stats.main.clues.beginner.score}
      Easy: ${stats.main.clues.easy.score}
      Medium: ${stats.main.clues.medium.score}
      Hard: ${stats.main.clues.hard.score}
      Elite: ${stats.main.clues.elite.score}
      Master: ${stats.main.clues.master.score}`,
      inline: false,
    });

    return interaction.followUp({ embeds: [embed] });
  },
});
