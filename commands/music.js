const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const queue = new Map();

// followed this tutorial https://www.youtube.com/watch?v=riyHsgI2IDs&t=648s
module.exports = {
    name: "music",
    description: "Plays some tunes for the boys",
    async execute(message) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions');
        const prefix = `${process.env.prefix}`;
        const args = message.content.slice(prefix.length).split(/  +/);

        const server_queue = queue.get(message.guild.id);
        // console.log(message)
        if (message.content.includes('play')) {
            if (!args.length) return message.channel.send('You didnt even give me a song name/link 😡');
            let song = {};

            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = {
                    title: song_info.videoDetails.title,
                    url: song_info.videoDetails.video_url
                }
            } else {
                //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
                const video_finder = async (query) => {
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if (video) {
                    song = {
                        title: video.title,
                        url: video.url
                    }
                } else {
                    message.channel.send('yaw man, I cant find the video');
                    return;
                }
            }
            //If the server queue does not exist (which doesn't for the first video queued) then create a constructor to be added to our global queue.
            if (!server_queue) {

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }

                //Add our key and value pair into the global queue. We then use this to get our server queue.
                queue.set(message.guild.id, queue_constructor);
                if (song !== {}) queue_constructor.songs.push(song);

                //Establish a connection and play the song with the vide_player function.
                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('I cant connect man');
                    throw err;
                }
            } else {
                server_queue.songs.push(song);
                return message.channel.send(`**${song.title}** will be played after this song 😎`);
            }
        } else if (message.content.includes('skip')) skip_song(message, server_queue);
        else if (message.content.includes('stop')) stop_song(message, server_queue);
    }
}

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {
        filter: 'audioonly'
    });
    song_queue.connection.play(stream, {
            seek: 0,
            volume: 0.5
        })
        .on('finish', () => {
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0]);
        });
    await song_queue.text_channel.send(`We do be listening to **${song.title}**`)
}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if (!server_queue) {
        return message.channel.send(`There are no songs 😂`);
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if (server_queue) server_queue.songs = [];
    if (server_queue) server_queue.connection.dispatcher.end().catch((e) => console.log(e));
}