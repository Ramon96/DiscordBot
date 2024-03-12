import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/command";
import { HottieSchema } from "../../models/hottie";

export default new Command({
  name: "addcolor",
  description: "Changes your hottie bar color",
  options: [
    {
      name: "color",
      description: "The color you want to set in hex format",
      type: ApplicationCommandOptionType.String,
      required: true,
      min_length: 7,
      max_length: 7,
    },
  ],
  run: async ({ interaction, args }) => {
    if (!interaction) return;

    if (!args) return interaction.followUp("Please provide a valid hex color");

    const color = args.getString("color");
    const userId = interaction.user.id;

    const hexColor = /^#[0-9a-fA-F]{6}$/;

    if (!color) {
      return interaction.followUp("Please provide a valid hex color");
    }

    if (!hexColor.test(color)) {
      return interaction.followUp("Please provide a valid hex color");
    }

    const Hottie = await HottieSchema.findOne({
      discordId: userId,
    });

    if (!Hottie) {
      interaction.followUp("Hottie not found! INTRUDER ALERT!");
    } else {
      Hottie.color = color;
      await Hottie.save();
      interaction.followUp(`Your color has been set to ${color}`);
    }
  },
});
