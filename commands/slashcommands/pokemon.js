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
    
        try {
            const data = await fetchPokemon(pokemon);
            // console.log(data);
            if (!data) {
                console.log('in the try')
                // throw 'Pokemon not found';
                return interaction.reply(`I couldn't find "${pokemon} in the database".`);
            }
            
            console.log(data.abilities)

            const sprite = data.sprites.front_default;
            const name = data.name;
            const type = data.types.map(t => t.type.name).join(", ");
            const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join("\n");
            let typeChart = data.types.length > 1 
            ? pokeTypes.getTypeWeaknesses(data.types[0].type.name, data.types[1].type.name)
            : pokeTypes.getTypeWeaknesses(data.types[0].type.name)
            const weakness = getKeyByValue(typeChart, 2);
            const immunity = getKeyByValue(typeChart, 0);
            const hiddenAbility = data.abilities.find(a => a.is_hidden) ? data.abilities.find(a => a.is_hidden).ability.name : "none";
            const abilities = data.abilities.filter(a => a.is_hidden == false).map(a => a.ability.name).join(", ");

            console.log(data.abilities);
            console.log(hiddenAbility);
             const embed = new MessageEmbed()
                 .setTitle(name)
                 .setColor("#0099ff")
                 .setThumbnail(sprite)
                 .addField("Type", type, false)
                 .addField("Stats", stats, false)
                 .addField("abilities", abilities, true)
                 .addField("hidden ability", hiddenAbility, false)
                 .addField("weakness", weakness.join(", "), true);

            if (immunity.length > 0) {
                embed.addField("immunity", immunity.join(", "), true);
            } else {
                embed.addField("immunity", "no immunity", true);
            }
                               
            interaction.reply(`Getting ${data.name}'s stats.`);
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