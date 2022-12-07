module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        /* Getting all the setted client's commands that has been set in deploy-commands.js. */
        const command = client.slashCommands.get(interaction.commandName);
        /* If there are no commands, return. */
        if (!command) return;
        /* Try executing the command. If this doesn't work, throw a error. */
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        };
    },
}