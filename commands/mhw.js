module.exports = {
    name: "mhw",
    description: "Picks a random Monster Hunter World class",
    execute(message) {
        const weaponCategories = ["Sword and Shield", "Great Sword", "Dual Blades", "Long Sword", "Hammer", "Hunting Horn", "Lance", "Gunlance", "Switch Axe", "Charge Blade", "Insect Glaive", "Bow", "Light Bowgun", "Heavy Bowgun"]

        message.reply("Should go for the " + weaponCategories[Math.floor(Math.random() * weaponCategories.length)]);
    }
}