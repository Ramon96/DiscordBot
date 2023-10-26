import { SlashCommandBuilder } from "@discordjs/builders";
import storePlayer from "../../helpers/osrs/storePlayer";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .addStringOption((option) =>
      option
        .setName("osrs_name")
        .setDescription(
          "The name of you osrs account. Use '_' for spaces in your username"
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("discord_user")
        .setDescription("Who's account is this?")
        .setRequired(true)
    )
    .setDescription("Add you Osrs account to the database."),
  name: "add",
  execute(interaction: CommandInteraction) {
    const rsn = interaction.options.getString("osrs_name");
    const mention = interaction.options.getUser("discord_user");

    if (rsn === null) {
      interaction.reply("Please provide a valid OSRS username.");
      return;
    }

    if (mention === null) {
      interaction.reply("Please provide a valid Discord user.");
      return;
    }

    storePlayer(rsn, mention.id).then((res) => {
      if (res == false) {
        interaction.reply(
          "Runescape username was not found in the highscores, use '_' for spaces in your username"
        );
      } else {
        interaction.reply(`${rsn} was succesfully added to the collection.`);
      }
    });
  },
};
