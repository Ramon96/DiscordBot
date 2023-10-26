import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { storeColor } from "../../helpers/functions/storeColor";

export const data = new SlashCommandBuilder()
  .setName("addcolor")
  .addStringOption((option) =>
    option
      .setMinLength(7)
      .setMaxLength(7)
      .setName("hex_color")
      .setDescription("color in hex for example #FF0000 for the color red")
      .setRequired(true)
  )
  .setDescription("Set a favorite color.");

export const execute = async (interaction: CommandInteraction) => {
  const userId = interaction.user.id;
  const color = interaction.options.getString("hex_color");

  if (!color) return interaction.reply("Please provide a color.");

  const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
  if (!hexColorRegex.test(color)) {
    return interaction.reply(
      "Invalid hex color format. Please provide a valid hex color."
    );
  }

  try {
    await storeColor(userId, color);
    interaction.reply(
      `successfully set the color to ${color} for ${interaction.user.username}`
    );
  } catch (error) {
    console.error(error);
    interaction.reply("something went wrong while storing the color");
  }
};
