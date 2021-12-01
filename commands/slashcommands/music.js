const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Some music for the boyes")
    .addSubcommand(play => 
         play
            .setName("play")
            .setDescription("Play a song")
            .addStringOption(song => song.setName("song").setRequired(true).setDescription("The song you want to play"))
    )
    .addSubcommand(volume =>
        volume
            .setName("volume")
            .setDescription("Change the volume")
            .addIntegerOption(vol => vol.setName("volume").setRequired(true).setDescription("The volume you want to set"))
    )
    .addSubcommand(settings =>
        settings
            .setName("settings")
            .setDescription("Change the settings")
            .addStringOption(setting => 
                setting
                    .setName("options")
                    .setRequired(true)
                    .setDescription("The option you want to change")
                    .addChoice('queue', 'queue')
                    .addChoice('skip', 'skip')
                    .addChoice('pause', 'pause')
                    .addChoice('resume', 'resume')
                    .addChoice('stop', 'stop'))
    
    ),
    name: "music",
    description: "Plays a song from the queue",
    permissions: "ADMINISTRATOR",
    async execute(interaction) {
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;
        const client = interaction.client;

        if(!VoiceChannel) {
            return interaction.reply({content: "You must be in a voice channel to use this command!", emphemeral: true});
        }

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) {
            return interaction.reply({content: "You must be in the same voice channel as me to use this command!", emphemeral: true});
        }

        try {
            switch(interaction.options._subcommand) {
                case "play": {
                    client.distube.playVoiceChannel(VoiceChannel, options.getString("song"), {textChannel: channel, member: member});
                    return interaction.reply({content: "Playing song: " + options.getString("song")});
                }
                case "volume": {
                    const volume = options.getNumber("volume");
                    if (volume < 0 || volume > 100) {
                        client.distube.setVolume(options.getNumber("volume"));
                        return interaction.reply({content: "Volume set to " + options.getNumber("volume") + "%"});
                    }
                    return interaction.reply({content: "Volume must be between 0 and 100"});
                }
                case "settings": {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if(!queue) {
                        return interaction.reply({content: "There is no queue for this voice channel!"});
                    }

                    switch(interaction.options._hoistedOptions[0].value) {
                        case "skip":
                            queue.skip(VoiceChannel);
                            return interaction.reply({content: "Skipped song!"});
                        case "pause":
                            queue.pause(VoiceChannel);
                            return interaction.reply({content: "Paused song!"});
                        case "resume":
                            queue.resume(VoiceChannel);
                            return interaction.reply({content: "Resumed song!"});
                        case "stop":
                            queue.stop(VoiceChannel);
                            return interaction.reply({content: "Stopped song!"});
                            case "queue":
                            const embed = new MessageEmbed()
                                .setTitle("Queue")
                                .setColor("#0099ff")
                                .setDescription(queue.songs.map((song, index) => `${index + 1}. ${song.title}`).join("\n"));
                            return interaction.reply({embed: embed});
                    }
                }
            }
        } catch (error) {
           const errorEmbed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Error")
                .setDescription(error.message)
                .setTimestamp();
            interaction.reply({embeds: [errorEmbed]});
        }
    }
}