import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("rng")
  .setDescription(
    "Rolls the dice between 1 - 9. Get kicked if the dice lands on 9"
  );
export const name = "rng";
export function execute(interaction: CommandInteraction) {
  let rng = Math.floor(Math.random() * 9) + 1;

  if (!interaction.channel) return;

  if (rng == 9) {
    // let victim = interaction.user;
    const victimId = interaction.member?.user.id;
    if (!victimId) return;
    const victim = interaction.guild?.members.cache.get(victimId);
    if (!victim) return;

    interaction.reply("The hammer rolled a " + rng + ". Get fucked!");
    interaction.channel.send({
      files: [
        "https://www.ssbwiki.com/images/thumb/a/a3/GameWatchSide2-SSB4.png/200px-GameWatchSide2-SSB4.png",
      ],
      content: "Beep!",
    });
    setTimeout(function () {
      victim
        .kick("The hammer rolled a 9. Get Fucked.")
        .then(() => console.log("succes"))
        .catch(console.error);
    }, 3000);
  } else {
    interaction.reply("You have been hit by a " + rng);
    interaction.channel.send({
      content: "Beep!",
      files: [
        "https://www.ssbwiki.com/images/thumb/e/ec/GameWatchSide1-SSB4.png/200px-GameWatchSide1-SSB4.png",
      ],
    });
  }
}
