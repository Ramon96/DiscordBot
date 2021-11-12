require('dotenv').config({});
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES
    ], 
    partials: [
        'MESSAGE', 
        'CHANNEL', 
        'REACTION'
    ] 
});
const music = require('@koenie06/discord.js-music');
const mongoose = require('mongoose');
const fs = require('fs');

client.commands = new Collection();
client.slashCommands = new Collection();
client.events = new Collection();

/* This will run when a new song started to play */
music.event.on('playSong', (channel, songInfo, requester) => {
	channel.send({ content: `Started playing the song [${songInfo.title}](${songInfo.url}) - ${songInfo.duration} | Requested by \`${requester.tag}\`` });
});

/* This will run when a new song has been added to the queue */
music.event.on('addSong', (channel, songInfo, requester) => {
	channel.send({ content: `Added the song [${songInfo.title}](${songInfo.url}) - ${songInfo.duration} to the queue | Added by \`${requester.tag}\`` });
});

/* This will run when a song started playing from a playlist */
music.event.on('playList', async (channel, playlist, songInfo, requester) => {
    channel.send({
        content: `Started playing the song [${songInfo.title}](${songInfo.url}) by \`${songInfo.author}\` of the playlist ${playlist.title}.
        This was requested by ${requester.tag} (${requester.id})`
    });
});

/* This will run when a new playlist has been added to the queue */
music.event.on('addList', async (channel, playlist, requester) => {
    channel.send({
        content: `Added the playlist [${playlist.title}](${playlist.url}) with ${playlist.videos.length} amount of videos to the queue.
        Added by ${requester.tag} (${requester.id})`
    });
});

/* This will run when all the music has been played, and the bot disconnects. */
music.event.on('finish', (channel) => {
	channel.send({ content: `All music has been played, disconnecting..` });
});


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