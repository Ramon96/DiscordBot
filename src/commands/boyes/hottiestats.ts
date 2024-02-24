import { AttachmentBuilder } from "discord.js";
import { generateChart } from "../../helpers/hotd/generateChart";
import { HottieSchema } from "../../models/hottie";
import { Command } from "../../structures/command";

export default new Command({
  name: "hotdchart",
  description: "shows the hottie of the day chart",
  run: async ({ interaction }) => {
    if (!interaction) return;

    const hotties = await HottieSchema.find({});

    const hottieChart = await generateChart(interaction, hotties);

    if (!hottieChart) {
      await interaction.followUp("No hotties found");
      return;
    }

    const hottieAttachment = new AttachmentBuilder(hottieChart, {
      name: "hotd.png",
    });

    await interaction.followUp({ files: [hottieAttachment] });
  },
});
