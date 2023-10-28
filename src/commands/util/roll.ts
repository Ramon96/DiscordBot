import { Command } from "../../structures/command";

export default new Command({
  name: "roll",
  description: "Rolls a dice between 1 - 100",
  run: async ({ interaction }) => {
    const sides = 100;
    const result = Math.floor(Math.random() * sides) + 1;
    console.log(interaction.user);
    interaction.followUp(
      `${result} for [Greed] by ${interaction.user.globalName}`
    );
  },
});
