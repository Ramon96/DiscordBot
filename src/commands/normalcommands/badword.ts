import { Message, GuildEmoji } from "discord.js";

export const name = "badword";
export const description = "Reacts to a bad word with an emoji";
export async function execute(message: Message) {
  const shanoW = message.guild?.emojis.cache.find(
    (emoji: GuildEmoji) => emoji.name === "shanoW"
  );
  if (shanoW) {
    await message.react(shanoW);
  }
}
