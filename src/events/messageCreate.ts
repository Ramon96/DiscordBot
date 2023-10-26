export const name = "messageCreate";
export function execute(client: any, msg: any) {
  let message = msg.content.toLowerCase();

  if (
    message.includes(process.env.triggerword1) ||
    message.includes(process.env.triggerword2)
  ) {
    client.commands.get("badword").execute(msg);
  } else if (message.startsWith(`${process.env.prefix}osrs`)) {
    client.commands
      .get("highscore")
      .execute(client.channels.cache.get("872200569257873458"), client);
    msg.delete({
      timeout: 100,
    });
  } else if (
    message.includes("maplestory") ||
    message.includes("maple") ||
    message.includes("mesos")
  ) {
    msg.author.send("MES0S PL0X").catch(console.error);
  } else if (message.includes("lik me") || message.includes("lik mijn")) {
    msg.reply("👅 💦🌰");
  } else if (message.startsWith(`${process.env.prefix}daily`)) {
    client.commands.get("dailymessage").execute(client, msg);
  } else if (message.startsWith(`${process.env.prefix}birthday`)) {
    client.commands.get("birthday").execute(client, msg);
  } else if (message.includes("gz")) {
    client.commands.get("gz").execute(client, msg);
  } else if (
    message.includes("test") &&
    msg.author.id == "294200096763936769"
  ) {
    client.commands.get("test").execute(client, msg);
  }
}
