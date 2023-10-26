import QuickChart from "quickchart-js";

function getHighestCountUsername(hotties: any[]) {
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

const fetchChart = async (data: any[]) => {
  const chart = new QuickChart();

  chart.setWidth(800);
  chart.setHeight(400);
  chart.setVersion("2");

  chart.setConfig({
    type: "bar",
    data: {
      labels: data.map((user: { username: any }) => user.username),
      datasets: [
        {
          label: "Users",
          data: data.map((user: { count: any }) => user.count),
          backgroundColor: data.map((user: { color: any }) => {
            return user.color ? user.color : generateRandomRGBColor();
          }),
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        //@ts-ignore
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
        //@ts-ignore
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
        //@ts-ignore
        backgroundImageUrl: getHighestCountUsername(data),
      },
    },
  });

  return await chart.toBinary();
};

export default fetchChart;
