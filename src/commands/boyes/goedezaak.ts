import { Command } from "../../structures/command";

export default new Command({
  name: "goedezaak",
  description: "shows a goedezaak when a user says gz",
  run: async ({ message }) => {
    if (!message) return console.log("Message not found");

    const channel = message.channel;
    if (!channel) return console.log("Channel not found");

    const goedenZaken = [
      "./src/assets/goedenzaken/gz1.png",
      "./src/assets/goedenzaken/gz2.png",
    ];

    const randomGoedeZaak =
      goedenZaken[Math.floor(Math.random() * goedenZaken.length)];

    channel.send({
      files: [randomGoedeZaak],
    });
  },
});
