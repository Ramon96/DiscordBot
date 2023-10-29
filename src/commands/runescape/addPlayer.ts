import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/command";
import hiscores from "osrs-json-hiscores";
import { OsrsSchema } from "../../models/osrs-schema";

export default new Command({
  name: "addplayer",
  description: "add a player to the database",
  options: [
    {
      name: "osrs_name",
      description: "your osrs name",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "discord_user",
      description: "your discord user",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async ({ interaction, args }) => {
    const osrsName = args.getString("osrs_name");
    const discordUser = args.getUser("discord_user");

    if (OsrsSchema.exists({ discordId: discordUser.id, osrsName: osrsName })) {
      return interaction.followUp("You are already in the database");
    }

    if (!osrsName || !discordUser) {
      return interaction.followUp(
        "Please provide both your osrs name and discord user"
      );
    }

    const playerStats = await hiscores.getStats(osrsName).catch((err) => {
      interaction.followUp("osrs name not found on hiscores");
    });

    if (!playerStats) {
      return interaction.followUp("osrs name not found on hiscores");
    }

    const player = new OsrsSchema({
      discordId: discordUser.id,
      osrsName,
      stats: playerStats.main.skills,
    });

    await player.save();

    interaction.followUp(`${osrsName} has been added to the database`);
  },
});
