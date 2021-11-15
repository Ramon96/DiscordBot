const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetchPokemon = require('../../helpers/api/pokemon/fetchPokemon');
const pokeTypes = require('poke-types');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pokemon")
    .addStringOption(option => option.setName("pokemon").setDescription("Name of the pokemon you want to look up.").setRequired(true))
    .setDescription("Show the basic stats of a pokemon"),
    name: "pokemon",
    async execute(interaction) {
        const pokemon = interaction.options.getString("pokemon");
        const cleanString = pokemon.replace(/ /g, '-');
    
        try {
            const data = await fetchPokemon(cleanString);

            if (!data) {
                return interaction.reply(`I couldn't find "${pokemon}" in the database.`);
            }

            const sprite = data.sprites.front_default;
            const name = data.name;
            const type = data.types.map(t => t.type.name).join(", ");
            const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join("\n");
            const evs = data.stats.map(s => `${s.stat.name}: ${s.effort}`).join("\n");
            let typeChart = data.types.length > 1 
            ? pokeTypes.getTypeWeaknesses(data.types[0].type.name, data.types[1].type.name)
            : pokeTypes.getTypeWeaknesses(data.types[0].type.name)
            const weakness2x = getKeyByValue(typeChart, 2).length > 0 ? getKeyByValue(typeChart, 2).join(', ') : 'No 2x weakness';
            const weakness4x = getKeyByValue(typeChart, 4).length > 0 ? getKeyByValue(typeChart, 4).join(', ') : 'No 4x weakness';
            const immunity = getKeyByValue(typeChart, 0).length > 0 ? getKeyByValue(typeChart, 0).join(', ') : 'No immunity';
            const hiddenAbility = data.abilities.find(a => a.is_hidden) ? data.abilities.find(a => a.is_hidden).ability.name : "none";
            const abilities = data.abilities.filter(a => a.is_hidden == false).map(a => a.ability.name).join(", ");

            const embed = new MessageEmbed()
            .setTitle(name)
            .setColor("#0099ff")
            .setThumbnail(sprite)
            .addField("Type", type, true)
            .addField("Stats", stats, true)
            .addField("Ev's", evs, false)
            .addField("abilities", abilities, false)
            .addField("hidden ability", hiddenAbility, false)
            .addField("2x weakness", weakness2x, true)
            .addField("4x weakness", weakness4x, true)
            .addField("immunity", immunity, true);
                               
            interaction.reply(`Getting ${pokemon}'s stats.`);
            interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply(`I couldn't find "${pokemon}".`);
        }
    }
}

// get key by value in object
const getKeyByValue = (object, value) => {
    return Object.keys(object).filter(key => object[key] === value);
}