import { Command } from "../../structures/command";

export default new Command({
  name: "ping",
  description: "Pong!",
  run: async ({ interaction }) => {
    if (!interaction) return;
    interaction.followUp("Pong!");
  },
});
