module.exports = {
  name: "gz",
  description: "replies to the channel with a random gz image",
  async execute(client, message) {
    const channel = message.channel;

    const gzImages = ["./images/gz1.png", "./images/gz2.png"];

    const randomGzImage = gzImages[Math.floor(Math.random() * gzImages.length)];

    channel.send({
      files: [randomGzImage],
    });
  },
};
