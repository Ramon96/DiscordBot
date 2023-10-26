export const name = "gz";
export const description = "replies to the channel with a random gz image";
export async function execute(client: any, message: any) {
  const channel = message.channel;

  const gzImages = ["./images/gz1.png", "./images/gz2.png"];

  const randomGzImage = gzImages[Math.floor(Math.random() * gzImages.length)];

  channel.send({
    files: [randomGzImage],
  });
}
