export const name = "test";
export const description = "test command to display data during development";
export async function execute(client: any, message: any) {
  message.delete({ timeout: 100 });

  const banner = `https://cdn.discordapp.com/banners/${message.author.id}/${message.author.banner}?size=512`;
  console.log(banner);
  // console.log(message);
  // console.log(await message.author);
}
