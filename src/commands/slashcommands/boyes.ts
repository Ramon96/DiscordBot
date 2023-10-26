import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageAttachment,
} from "discord.js";
import capatalize from "../../helpers/functions/capatalize";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lore")
    .setDescription("get boyes specific lore."),
  name: "lore",
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("boyes")
        .setPlaceholder("Kies lore")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
          {
            label: "Daniel",
            description: "leer meer over deze retard",
            value: "daniel",
          },
          {
            label: "Daan",
            description: "leer meer over deze retard",
            value: "daan",
          },
          {
            label: "Julian",
            description: "leer meer over deze retard",
            value: "julian",
          },
          {
            label: "Ramon",
            description: "leer meer over deze retard",
            value: "ramon",
          },
          {
            label: "De mannen",
            description: "leer meer over de legendarische league duo",
            value: "mannen",
          }
        )
    );

    interaction.reply({ content: "Kies je lore", components: [row] });

    const channel = interaction.channel;
    if (!channel) return;
    const collector = channel.createMessageComponentCollector({});

    collector.once("collect", async (select) => {
      // Dit kan zo maar de rede zijn dat de commando het niet meer doet.
      //@ts-ignore
      const selected = select.values[0];
      const embed = new MessageEmbed().setTitle(capatalize(selected));
      let file;

      switch (selected) {
        case "daniel":
          file = new MessageAttachment("./images/danielframe.gif");
          embed
            .setImage("attachment://danielframe.gif")
            .setDescription(
              "Womanizer is niet de enige waar deze man bekend om staat. De man draagt dan ook de verantwoordelijkheid om zijn stad tegen de vele gevaren te beschermen. Healers zijn in deze tijden van corona erg schaars maar dit is geen issue voor de boyes. Ook hechtingen verwijderen is voor Daniel dan ook geen uitdagende klus en doet dit gerust met een glaasje whisky."
            );
          break;
        case "daan":
          file = new MessageAttachment("./images/daanframe.gif");
          embed
            .setImage("attachment://daanframe.gif")
            .setDescription(
              "Ongelofelijk. Dit gaat niet over hoe ongelofelijk lekker hij is, maar elke keer dat de boyes weer iets in hun schild uitvoeren is dit wat er in zijn heerlijke koppie omgaat. De tank die elke party nodig heeft en de man waar elke boye achter mag staan. Heren, Dak van de markt of mangos. Geen enkele feest is gevaar met deze tank in hun nabijheid. "
            );
          break;
        case "julian":
          file = new MessageAttachment("./images/julianframe.gif");
          embed
            .setImage("attachment://julianframe.gif")
            .setDescription(
              "Julian wil graag de wereld veroveren, maar wat hij echt veroverd zijn de harten van de boyes. Holy moly denken ze dan, als deze heerlijke jongen weer om een Elton John vraagt. Aftrekken op het balkon is hij dan ook niet vies van."
            );
          break;
        case "ramon":
          file = new MessageAttachment("./images/ramonframe.gif");
          embed
            .setImage("attachment://ramonframe.gif")
            .setDescription(
              "Ramon is van nature al edgy en heeft dus geen edgy class nodig om de wereld te laten zien hoe edgy hij is. Van zijn geluk lijkt nog veel te blijven, al beseft hij niet hoeveel geluk hij heeft dat hij met 1 luck onderdeel mag uitmaken van de boyes."
            );
          break;
        case "mannen":
          file = new MessageAttachment("./images/mannen.jpg");
          embed
            .setImage("attachment://mannen.jpg")
            .setDescription(
              'Met de hulp van Skaarl kan Julian de hele wereld veroveren. De wereld domineren is dan ook een van Julian zijn doelen. Gelukkig staat Julian er niet alleen voor. Julian word ondersteund door zijn Surinamer "Ramon" Die Julian ondersteund al het gif in de wereld te bestrijden. Als Ramon en Julian gezien worden horen ze in de verte al : "Kijk daar heb je de mannen!"'
            );
          break;
        default:
          console.error("This value does not exist");
          return;
      }

      await interaction.editReply({
        content: `Gekozen lore: ${capatalize(selected)}`,
        embeds: [embed],
        components: [],
        files: [file],
      });
    });
  },
};
