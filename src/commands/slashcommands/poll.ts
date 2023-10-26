import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("poll")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question you want to poll")
      .setRequired(true)
  )
  .setDescription("Ask the group a question with a thump up and down response");
export const name = "poll";
export function execute(interaction: CommandInteraction) {
  const question = interaction.options.getString("question");

  interaction.reply("sending the poll");
  if (interaction.channel) {
    interaction.channel.send(`🤔 **${question}**`).then((reaction) => {
      reaction.react("👍");
      reaction.react("👎");
    });
  }
}
