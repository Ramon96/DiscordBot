require("dotenv").config({});
const { Client, Collection } = require("discord.js");
const client = new Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const mongoose = require("mongoose");
const fs = require("fs");

client.commands = new Collection();
client.slashCommands = new Collection();
client.events = new Collection();
module.exports = client;

mongoose.connect(
  `mongodb+srv://admin:${process.env.mongoose}@osrsboys.rc9hb.azure.mongodb.net/test`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

function loadCommandsFromDirectory(
  directoryPath: string,
  targetMap: Map<string, any>
) {
  const commandFiles: string[] = fs
    .readdirSync(directoryPath)
    .filter((file: string) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const command = require(`${directoryPath}/${file}`);
    targetMap.set(command.name, command);
  }
}

function loadCommands() {
  loadCommandsFromDirectory("./commands/normalcommands/", client.commands);
}

function loadSlashCommands() {
  loadCommandsFromDirectory("./commands/slashcommands/", client.slashCommands);
}

function loadEvents() {
  const eventFiles: string[] = fs
    .readdirSync("./events/")
    .filter((file: string) => file.endsWith(".ts"));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    } else {
      client.on(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    }
  }
}
loadCommands();
loadSlashCommands();
loadEvents();

client.login(process.env.token);
