/* Requiring all the stuff to register the Commands with. */
import dotenv from "dotenv";
dotenv.config({});
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import { ApplicationCommandData } from "discord.js";

/* Pushing all the commands in your 'commands' folder into a array. */

const commands: Array<ApplicationCommandData> = [];
const commandFiles = fs
  .readdirSync("src/commands/slashcommands/")
  .filter((file: string) => file.endsWith(".ts"));

/* Pass in the guild ID of the guild you want to push the commands to. */

const guildId = "867074325824012379";
const clientId = "675080598355705899";

async function loadCommands() {
  for (const file of commandFiles) {
    const { default: command } = await import(
      `src/commands/slashcommands/${file}`
    );
    console.log(command.data.name);
    commands.push(command.data.toJSON());
  }
}
// const command = require(`./commands/slashcommands/8ball.js`);
// console.log(command.data.name)
// commands.push(command.data.toJSON());

/* Registering the commands to the API. */

const rest = new REST({ version: "9" }).setToken(process.env.token as string);

loadCommands().then(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});
