import { client } from "..";
import { Event } from "../structures/event";

export default new Event("messageCreate", async (message) => {
  let msg = message.content.toLowerCase();

  if (msg.includes("lik me ") || msg.includes("lik mijn")) {
    const withoutLik = msg.replace("lik me ", "").replace("lik mijn", "");

    message.reply(`👅 💦 ${withoutLik}`);
  }

  // if (msg.includes("gz")) {
  //   client.commands
  //     .get("goedezaak")!
  //     .run({ client, message: message, args: null });
  // }
});
