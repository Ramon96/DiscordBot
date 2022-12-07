const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mhw")
        .setDescription("Picks a random Monster Hunter World class"),
    name: "mhw",
    execute(interaction) {
        const weaponCategories = ["Sword and Shield", "Great Sword", "Dual Blades", "Long Sword", "Hammer", "Hunting Horn", "Lance", "Gunlance", "Switch Axe", "Charge Blade", "Insect Glaive", "Bow", "Light Bowgun", "Heavy Bowgun"]

        interaction.reply("Should go for the " + weaponCategories[Math.floor(Math.random() * weaponCategories.length)]);
    }
}