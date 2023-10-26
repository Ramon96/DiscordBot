import { CommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("homey")
    .setDescription("Makes the bot say: ohh homeeyyy"),
  name: "homey",
  execute(interaction: CommandInteraction) {
    interaction.reply({
      tts: true,
      content: "Ohh Homeeyy",
    });
  },
};
