require('dotenv').config({});
const { Client, Collection } = require('discord.js');
const client = new Client({ 
    intents: 32767, 
    partials: [
        'MESSAGE', 
        'CHANNEL', 
        'REACTION'
    ] 
});
const mongoose = require('mongoose');
const fs = require('fs');

client.commands = new Collection();
client.slashCommands = new Collection();
client.events = new Collection();
module.exports = client;

mongoose.connect(`mongodb+srv://admin:${process.env.mongoose}@osrsboys.rc9hb.azure.mongodb.net/test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

function loadCommands() {
    const commandFiles = fs.readdirSync('./commands/normalcommands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/normalcommands/${file}`);
        client.commands.set(command.name, command);
    }
}

function loadSlashCommands() {
    const commandFiles = fs.readdirSync('./commands/slashcommands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/slashcommands/${file}`);
        client.slashCommands.set(command.name, command);
    }
}

function loadEvents() {
    const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if(event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
}

loadCommands();
loadSlashCommands();
loadEvents();

client.login(process.env.token);