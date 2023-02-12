const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetchPokemon = require("../../helpers/api/pokemon/fetchPokemon");
const pokeTypes = require("poke-types");
const getKeyByValue = require("../../helpers/functions/keyByValue");
const capatalize = require("../../helpers/functions/capatalize");

const colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pokemon")
    .addStringOption((option) =>
      option
        .setName("pokemon")
        .setDescription("Name of the pokemon you want to look up.")
        .setRequired(true)
    )
    .setDescription("Show the basic stats of a pokemon"),
  name: "pokemon",
  async execute(interaction) {
    const pokemon = interaction.options.getString("pokemon");
    const cleanString = pokemon.replace(/ /g, "-");

    try {
      const data = await fetchPokemon(cleanString);

      if (!data) {
        return interaction.reply(
          `I couldn't find "${pokemon}" in the database.`
        );
      }

      const sprite = data.sprites.front_default;
      const shinySprite = data.sprites.front_shiny;
      const name = capatalize(data.name);
      const type = data.types.map((t) => t.type.name).join(", ");
      const stats = data.stats
        .map((s) => `${s.stat.name}: ${s.base_stat}`)
        .join("\n");
      const evs = data.stats
        .map((s) => `${s.stat.name}: ${s.effort}`)
        .join("\n");
      let typeChart =
        data.types.length > 1
          ? pokeTypes.getTypeWeaknesses(
              data.types[0].type.name,
              data.types[1].type.name
            )
          : pokeTypes.getTypeWeaknesses(data.types[0].type.name);
      const weakness2x =
        getKeyByValue(typeChart, 2).length > 0
          ? getKeyByValue(typeChart, 2).join(", ")
          : "No 2x weakness";
      const weakness4x =
        getKeyByValue(typeChart, 4).length > 0
          ? getKeyByValue(typeChart, 4).join(", ")
          : "No 4x weakness";
      const immunity =
        getKeyByValue(typeChart, 0).length > 0
          ? getKeyByValue(typeChart, 0).join(", ")
          : "No immunity";
      const hiddenAbility = data.abilities.find((a) => a.is_hidden)
        ? data.abilities.find((a) => a.is_hidden).ability.name
        : "none";
      const abilities = data.abilities
        .filter((a) => a.is_hidden == false)
        .map((a) => a.ability.name)
        .join(", ");

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(`shiny-${data.name}`)
          .setLabel("Shiny form")
          .setStyle(1)
      );

      const embed = new MessageEmbed()
        .setTitle(name)
        .setColor(colours[data.types[0].type.name])
        .setThumbnail(sprite)
        .addField("Type", type, false)
        .addField("Stats", stats, true)
        .addField("Ev's", evs, true)
        .addField("abilities", abilities, false)
        .addField("hidden ability", hiddenAbility, false)
        .addField("2x weakness", weakness2x, true)
        .addField("4x weakness", weakness4x, true)
        .addField("immunity", immunity, true);

      const shinyEmbed = new MessageEmbed()
        .setTitle(`Shiny ${name}`)
        .setColor(colours[data.types[0].type.name])
        .setImage(shinySprite);

      const collector = interaction.channel.createMessageComponentCollector({});

      await interaction.deferReply();
      await interaction.followUp({
        embeds: [embed],
        components: [row],
      });

      collector.once("collect", async (button) => {
        await button.deferReply();

        await button.editReply({ embeds: [shinyEmbed], components: [] });
      });
    } catch (error) {
      console.error(error);
      return interaction.reply(`I couldn't find "${pokemon}".`);
    }
  },
};
