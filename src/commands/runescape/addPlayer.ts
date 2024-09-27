import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "@/structures/command";
import hiscores from "osrs-json-hiscores";
import { OsrsSchema } from "@/models/osrs-schema";

new Command({
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
    if (!interaction) return;
    
    if (!args)
      return interaction.followUp(
        "Please provide both your osrs name and discord user"
      );

    const osrsName = args.getString("osrs_name");
    const discordUser = args.getUser("discord_user");

    if (!discordUser || !osrsName) {
      return interaction.followUp("Please provide a valid discord and osrs user");
    }

    if (
      await OsrsSchema.exists({ discordId: discordUser.id, osrsName: osrsName })
    ) {
      return interaction.followUp("You are already in the database");
    }


    await hiscores.getStats(osrsName)
        .then(async (playerStats) =>  {
          if(!playerStats.main) {
            await interaction.followUp("osrs name not found on hiscores");
          }

          const player = new OsrsSchema({
            discordId: discordUser.id,
            osrsName,
            stats: playerStats.main?.skills,
          });

          await player.save();

          await interaction.followUp(`${osrsName} has been added to the database`);
          
        })    
        .catch(() => {
          interaction.followUp("osrs name not found on hiscores");
      });
  },
});
