const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("poll")
    .addStringOption(option => option.setName("question").setDescription('The question you want to poll').setRequired(true))
    .setDescription("Ask the group a question with a thump up and down response"),
    name: "poll",
    execute(interaction) {
        const question = interaction.options.getString("question");

        interaction.reply('sending the poll')
        interaction.channel.send(`🤔 **${question}**`).then(reaction => {
            reaction.react('👍');
            reaction.react('👎');
        });
    }
}