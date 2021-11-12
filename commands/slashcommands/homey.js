const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("homey")
    .setDescription("Makes the bot say: ohh homeeyyy"),
    name: "homey",
    execute(interaction) {
        interaction.reply({ tts: true, content: "Ohh Homeeyy" });
    }
}