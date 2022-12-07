const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("guide")
        .setDescription("a guide that teaches you how to do the stronghold security. without this guide you die."),
    name: "guide",
    execute(interaction) {
        interaction.reply(`https://www.youtube.com/watch?v=-DW95B4QqlU`)
    }
}