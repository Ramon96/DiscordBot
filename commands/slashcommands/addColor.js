const { SlashCommandBuilder } = require("@discordjs/builders");
const storeColor = require("../../helpers/functions/storeColor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcolor")
    .addStringOption((option) =>
      option
        .setMinLength(7)
        .setMaxLength(7)
        .setName("hex_color")
        .setDescription("color in hex for example #FF0000 for the color red")
        .setRequired(true)
    )
    .setDescription("Set a favorite color."),
  name: "addcolor",
  execute(interaction) {
    const userId = interaction.user.id;
    const color = interaction.options.getString("hex_color");

    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    if (!hexColorRegex.test(color)) {
      return interaction.reply(
        "Invalid hex color format. Please provide a valid hex color."
      );
    }

    storeColor(userId, color)
      .then(() => {
        interaction.reply(
          `sucessfuly set the color to ${color} for ${interaction.user.username}`
        );
      })
      .catch((error) =>
        interaction.reply("something went wrong while storing the color")
      );
  },
};
