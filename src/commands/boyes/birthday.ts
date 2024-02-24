import { ApplicationCommandOptionType, User } from "discord.js";
import { Command } from "../../structures/command";
import { UserSchema } from "../../models/user";

export default new Command({
  name: "birthday",
  description: "add your birthday to the database",
  options: [
    {
      name: "birthday",
      description: "your birthday in the format dd-mm-yyyy",
      required: true,
      type: ApplicationCommandOptionType.String,
      min_length: 10,
      max_length: 10,
    },
  ],
  run: async ({ interaction, args }) => {
    if (!interaction) return;
    if (!args) return interaction.followUp("Please provide a valid date");

    const userId = interaction.user.id;
    const birthday = args.getString("birthday");

    const validDate = /^\d{1,2}-\d{1,2}-\d{4}$/;

    if (!birthday) {
      return interaction.followUp(
        "Please provide a valid date in the format dd-mm-yyyy (e.g. 01-01-2021)"
      );
    }

    if (!validDate.test(birthday)) {
      return interaction.followUp(
        "Please provide a valid date in the format dd-mm-yyyy (e.g. 01-01-2021)"
      );
    }

    if (await UserSchema.exists({ discordId: userId })) {
      UserSchema.findOneAndUpdate(
        { discordId: userId },
        { birthday: birthday }
      );
      interaction.followUp(`Your birthday has been set to ${birthday}`);
      return;
    }

    const user = new UserSchema({
      id: userId,
      birthday: birthday,
    });

    await user.save();
    interaction.followUp(`Your birthday has been set to ${birthday}`);
  },
});
