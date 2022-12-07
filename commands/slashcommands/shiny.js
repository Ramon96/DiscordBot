const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const fetchPokemon = require('../../helpers/api/pokemon/fetchPokemon');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shiny")
        .addStringOption(option => option.setName("pokemon").setDescription("Name of the pokemon you want to look up.").setRequired(true))
        .setDescription("Show the shiny form of a pokemon"),
    name: "shiny",
    async execute(interaction) {
        const pokemon = interaction.options.getString("pokemon");

        try {
            const data = await fetchPokemon(pokemon);
            if (!data) {
                return interaction.reply(`I couldn't find "${pokemon}".`);
            }

            const shiny = data.sprites.front_shiny;
            if (!shiny) {
                return interaction.reply("That pokemon doesn't have a shiny form.");
            }

            await interaction.deferReply();
            await interaction.editReply(shiny);
            // await interaction.followUp(shiny);
        } catch (error) {
            console.error(error);
            return interaction.reply(`I couldn't find "${pokemon}".`);
        }
    }
}