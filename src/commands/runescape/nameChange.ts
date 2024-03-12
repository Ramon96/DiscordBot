import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/command";
import hiscores from "osrs-json-hiscores";
import { OsrsSchema } from "../../models/osrs-schema";

export default new Command({
  name: "namechange",
  description: "update your osrs username",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "old_rsn",
      description: "your old rsn",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "new_rsn",
      description: "your new rsn",
      required: true,
    },
  ],
  run: async ({ interaction, args }) => {
    if (!interaction) return;
    if (!args)
      return interaction.followUp("please provide both your old and new rsn");

    const oldRsn = args.getString("old_rsn");
    const newRsn = args.getString("new_rsn");

    if (!oldRsn || !newRsn) {
      return interaction.followUp("Please provide both your old and new rsn");
    }

    const playerStats = await hiscores.getStats(newRsn).catch((err) => {
      interaction.followUp("New rsn not found on hiscores");
    });

    if (!playerStats) {
      return interaction.followUp("New rsn not found on hiscores");
    }

    const user = await OsrsSchema.findOne({ osrsName: oldRsn });

    if (!user) {
      return interaction.followUp("Old rsn not found in database");
    }

    user.osrsName = newRsn;
    await user.save();

    interaction.followUp(`${oldRsn} has been changed to ${newRsn}`);
  },
});
