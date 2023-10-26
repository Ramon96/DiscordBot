import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("mhw")
  .setDescription("Picks a random Monster Hunter World class");
export const name = "mhw";
export function execute(interaction: CommandInteraction) {
  const weaponCategories = [
    "Sword and Shield",
    "Great Sword",
    "Dual Blades",
    "Long Sword",
    "Hammer",
    "Hunting Horn",
    "Lance",
    "Gunlance",
    "Switch Axe",
    "Charge Blade",
    "Insect Glaive",
    "Bow",
    "Light Bowgun",
    "Heavy Bowgun",
  ];

  interaction.reply(
    "Should go for the " +
      weaponCategories[Math.floor(Math.random() * weaponCategories.length)]
  );
}
