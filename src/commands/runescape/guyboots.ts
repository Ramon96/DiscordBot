import { Command } from "../../structures/command";

export default new Command({
  name: "guyboots",
  description: "guide on how to get guyboots",
  run: async ({ interaction }) => {
    interaction.followUp("https://www.youtube.com/watch?v=-DW95B4QqlU");
  },
});
