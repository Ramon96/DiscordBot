module.exports = {
  name: "test",
  description: "test command to display data during development",
  async execute(client, message) {
    message.delete({ timeout: 100 });

    const banner = `https://cdn.discordapp.com/banners/${message.author.id}/${message.author.banner}?size=512`;
    console.log(banner);
    // console.log(message);
    // console.log(await message.author);
  },
};
