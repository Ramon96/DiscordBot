const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .addStringOption(option => option.setName("time").setDescription("Example: 25s (25 seconds)").setRequired(true))
        .addStringOption(option => option.setName("item").setDescription("What is the potential price?"))
        .setDescription("Initiate a Roll, person with the highest roll wins"),
    name: "roll",
    async execute(interaction) {
        let item = interaction.options.getString("item");
        const time = interaction.options.getString("time");
        const participants = [];
        if (!time) return interaction.reply('add a time fool');

        const Embed = new MessageEmbed()
            .setColor(0x45150d)
            .setTitle(`${interaction.user.username} has initiated a roll!`)
            .setDescription(item ? `Roll for a ${item}!` : `Roll to win something!`)
            .setImage('https://media4.giphy.com/media/I38qmkMXsMOFKsuer9/giphy.gif?cid=ecf05e47xdyrn6x25g4sdbnd0lp5jzza868lsxrwhjqtdft5&rid=giphy.gif&ct=g')
            .addField(`Duration: `, ms(ms(time)))
            .setFooter('Click on the 🎲 to participate.')
            .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`)
            .setTimestamp();

        let sendEmbed = await interaction.channel.send({
            embeds: [Embed]
        });
        sendEmbed.react('🎲');

        setTimeout(async () => {
            try {
                const peopleReactedBot = await sendEmbed.reactions.cache.get("🎲").users.fetch();
                let peopleReacted = Array.from(peopleReactedBot.filter(u => u.id !== '675080598355705899'));

                if (peopleReacted.length <= 0) {
                    const EmbedNoJoin = new MessageEmbed()
                        .setColor(0x45150d)
                        .setTitle(`${interaction.user.username} has initiated a roll!`)
                        .setDescription(`Nobody joined the roll ${item ? 'for a ' + item : ''}. Roll ended`)
                        .addField(`Duration: `, `Roll has ended (${ms(ms(time))})`)
                        .setFooter('The roll has ended you can no longer participate')
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`)
                        .setTimestamp();

                    sendEmbed.edit({
                        embeds: [EmbedNoJoin]
                    })
                } else {
                    for (let i = 0; i < peopleReacted.length; i++) {
                        participants.push({
                            user: peopleReacted[i],
                            roll: Math.floor(Math.random() * 100) + 1
                        })
                    }

                    let highestRoll = Math.max(...participants.map(participant => participant.roll));
                    let winner = participants.find(participant => participant.roll === highestRoll);

                    const EmbedWinner = new MessageEmbed()
                        .setColor(0x45150d)
                        .setTitle(`${interaction.user.username} has initiated a roll!`)
                        .setDescription(item ? `${winner.user[1].username} has won a ${item}!` : `${winner.user[1].username} has won!`)
                        .setImage("https://cdn.discordapp.com/avatars/" + winner.user[1].id + "/" + winner.user[1].avatar + ".jpeg")
                        .addField(`Duration: `, `Roll has ended (${ms(ms(time))})`)
                        .setFooter('The roll has ended you can no longer participate')
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`)
                        .setTimestamp();

                    for (let i = 0; i < participants.length; i++) {
                        EmbedWinner.addField(`${participants[i].user[1].username}: `, `${participants[i].roll}`)
                    }

                    sendEmbed.edit({
                        embeds: [EmbedWinner]
                    })
                }
            } catch (e) {
                const EmbedNoJoin = new MessageEmbed()
                    .setColor(0x45150d)
                    .setTitle(`${interaction.user.username} has initiated a roll!`)
                    .setDescription(`Nobody joined the roll ${item ? 'for a ' + item : ''}. Roll ended`)
                    .addField(`Duration: `, `Roll has ended (${ms(ms(time))})`)
                    .setFooter('The roll has ended you can no longer participate')
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`)
                    .setTimestamp();

                sendEmbed.edit({
                    embeds: [EmbedNoJoin]
                })
            }

        }, ms(time));
    }
}