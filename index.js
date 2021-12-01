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
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const fs = require('fs');

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});
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

client.distube
    .on("playSong", (queue, song) => queue.textChannel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
    ))
    .on("addSong", (queue, song) => queue.textChannel.send(
        ` Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("addList", (queue, playlist) => queue.textChannel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", message => message.channel.send(`Searching canceled`))
    .on("error", (channel, e) => {
        channel.send(` An error encountered: ${e}`)
        console.error(e)
    })
    .on("empty", channel => channel.send("Voice channel is empty! Leaving the channel..."))
    .on("searchNoResult", message => message.channel.send(`No result found!`))
    .on("finish", queue => queue.textChannel.send("Finished!"))

client.login(process.env.token);