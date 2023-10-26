import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment } from "discord.js";
import hottieSchema from "../../model/hotties";
import fetchChart from "../../helpers/api/charts/fetchChart";

export const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Shows you a chart with the hottie of the day");
export const name = "stats";
export async function execute(interaction: CommandInteraction) {
  const hotties: any = [];

  await hottieSchema
    .find()
    .exec()
    .then(async (docs) => {
      for (const person of Object.keys(docs)) {
        const index = parseInt(person);
        const user = await interaction.client.users.fetch(docs[index].id);
        hotties.push({
          username: user.username,
          img: user.displayAvatarURL({ format: "png" }),
          color: docs[index].color,
          count: docs[index].count,
        });
      }
    });

  const imgBinary = await fetchChart(hotties);
  const imgAttachment = new MessageAttachment(imgBinary, "chart.png");
  await interaction.deferReply();
  await interaction.editReply({ files: [imgAttachment] });
}
