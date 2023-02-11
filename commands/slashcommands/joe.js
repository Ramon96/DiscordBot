const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joe")
    .setDescription(
      'says "hey peter" and shows a pic of joe swanson from family guy.'
    ),
  name: "joe",
  async execute(interaction) {
    const joe = new MessageAttachment(
      "https://static.wikia.nocookie.net/familyguy/images/9/9c/190px-Joe_Swanson.png"
    );

    await interaction.reply({
      tts: true,
      content: "Hey Peter",
    });

    await interaction.followUp({
      files: [joe],
    });
  },
};
