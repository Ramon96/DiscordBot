import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("magicconch")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question you want to ask the magic conch.")
      .setRequired(true)
  )
  .setDescription("Ask the magic conch for some valuable advise");
export const name = "magicconch";
export async function execute(interaction: CommandInteraction) {
  const answers = ["yes", "no", "maybe"];
  let roll = Math.floor(Math.random() * answers.length);
  const question = interaction.options.getString("question");

  const Embed = new MessageEmbed()
    .setColor(0x0457a0)
    .setTitle(`${interaction.user.username}: ${question}`)
    .setDescription(`🦪: **${answers[roll]}**`)
    .setImage("https://c.tenor.com/Y_dBpTURBncAAAAd/magic-conch-spongebob.gif");

  await interaction.reply({
    embeds: [Embed],
  });
}
