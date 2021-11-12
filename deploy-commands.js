/* Requiring all the stuff to register the Commands with. */
require('dotenv').config({});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

/* Pushing all the commands in your 'commands' folder into a array. */

const commands = [];
const commandFiles = fs.readdirSync('./commands/slashcommands/').filter(file => file.endsWith('.js'));

/* Pass in the guild ID of the guild you want to push the commands to. */

const guildId = '867074325824012379';
const clientId = '675080598355705899';

for (const file of commandFiles) {
	const command = require(`./commands/slashcommands/${file}`);
    console.log(command.data.name)
	commands.push(command.data.toJSON());
}
	// const command = require(`./commands/slashcommands/8ball.js`);
    // console.log(command.data.name)
	// commands.push(command.data.toJSON());



/* Registering the commands to the API. */

const rest = new REST({ version: '9' }).setToken(process.env.token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();