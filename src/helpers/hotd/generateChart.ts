import QuickChart from "quickchart-js";
import { generateRandomRGBColor } from "../utils/generateRGB";
import { CacheType, CommandInteraction } from "discord.js";
import {Hottie} from "../../typings/hotd";


async function getHottestHottie(
  interaction: CommandInteraction<CacheType>,
  hotties: Hottie[]
) {
  let highestCount = 0;
  let id = "";

  hotties.forEach((hottie) => {
    if (hottie.count > highestCount) {
      highestCount = hottie.count;
      id = hottie.id;
    }
  });

  const user = await interaction.client.users.fetch(id);
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}

export const generateChart = async (
  interaction: CommandInteraction<CacheType>,
  hotties: Hottie[]
) => {
  if (!interaction) return;

  const HottieUsers = await Promise.all(
    hotties.map(async (hottie) => {
      await interaction.client.users.fetch(hottie.id);
      return {
        username: interaction.client.users.cache.get(hottie.id)?.globalName,
        count: hottie.count,
        color: hottie.color,
      };
    })
  );

  const HottestHottieImage = await getHottestHottie(interaction, hotties);

  const chart = new QuickChart();

  chart.setWidth(800);
  chart.setHeight(400);
  chart.setVersion("2");

  chart.setConfig({
    type: "bar",
    data: {
      labels: HottieUsers.map((hottie) => hottie.username),
      datasets: [
        {
          label: "Users",
          data: HottieUsers.map((hottie) => hottie.count),
          backgroundColor: HottieUsers.map((hottie) => {
            return hottie.color ? hottie.color : generateRandomRGBColor();
          }),
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontStyle: "bold",
              fontFamily: "Sans",
              fontColor: "#F00",
              stepSize: 1,
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontFamily: "Sans",
              fontStyle: "bold",
              fontColor: "#F00",
            },
          },
        ],
      },
      plugins: {
        backgroundImageUrl: HottestHottieImage,
      },
    },
  });

  return await chart.toBinary();
};
