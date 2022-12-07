const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question you want to ask the magic conch.")
        .setRequired(true)
    )
    .setDescription("Ask the magic conch for some valuable advise"),
  name: "8ball",
  async execute(interaction) {
    const answers = ["yes", "no", "maybe"];
    let roll = Math.floor(Math.random() * answers.length);
    const question = interaction.options.getString("question");

    const Embed = new MessageEmbed()
      .setColor(0x0457a0)
      .setTitle(`${interaction.user.username}: ${question}`)
      .setDescription(`🦪: **${answers[roll]}**`)
      .setImage(
        "https://c.tenor.com/Y_dBpTURBncAAAAd/magic-conch-spongebob.gif"
      );

    await interaction.reply({
      embeds: [Embed],
    });
  },
};
