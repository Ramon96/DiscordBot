const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Hottie = require("../../model/hotties");
const fetchChart = require("../../helpers/api/charts/fetchChart");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows you a chart with the hottie of the day"),
  name: "stats",
  async execute(interaction) {
    const hotties = [];

    await Hottie.find()
      .exec()
      .then((docs) => {
        Object.keys(docs).forEach(async function (person) {
          const user = await interaction.client.users.fetch(docs[person].id);
          hotties.push({
            username: user.username,
            img: user.displayAvatarURL({ format: "png" }),
            color: docs[person].color,
            count: docs[person].count,
          });
        });
      });

    const imgBinary = await fetchChart(hotties);
    const imgAttachment = new MessageAttachment(imgBinary, "chart.png");
    await interaction.deferReply();
    await interaction.editReply({ files: [imgAttachment] });
  },
};
