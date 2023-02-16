const QuickChart = require("quickchart-js");

function getHighestCountUsername(hotties) {
  let highestCount = 0;
  let url = "";

  hotties.forEach((hottie) => {
    if (hottie.count > highestCount) {
      highestCount = hottie.count;
      url = hottie.img;
    }
  });
  return url;
}

// TODO naar helpers
function generateRandomRGBColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

const fetchChart = async (data) => {
  const chart = new QuickChart();

  chart.setWidth(800);
  chart.setHeight(400);
  chart.setVersion("2");

  chart.setConfig({
    type: "bar",
    data: {
      labels: data.map((user) => user.username),
      datasets: [
        {
          label: "Users",
          data: data.map((user) => user.count),
          backgroundColor: data.map((user) => {
            const color = user.bannerColor ? user.bannerColor : user.color;
            return color ? color : generateRandomRGBColor();
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
        backgroundImageUrl: getHighestCountUsername(data),
      },
    },
  });

  return await chart.toBinary();
};

module.exports = fetchChart;
