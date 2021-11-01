const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "roll",
    description: "Lets the user roll between 1 and 100",
    async execute(message, client) {
        const prefix = process.env.prefix + 'roll';
        const args = message.content.slice(prefix.length + 1).split(' ');

        let item = '';
        const time = args[0];
        const participants = [];
        if (!time) return message.channel.send('add a time fool');

        for (var i = 1; i < args.length; i++) {
            item += (args[i] + " ");
        }

        const Embed = new MessageEmbed()
            .setColor(0x45150d)
            .setTitle(`${message.author.username} has iniated a roll!`)
            .setDescription(item ? `Roll for a ${item}!` : `Roll to win something!`)
            .setImage('https://media4.giphy.com/media/I38qmkMXsMOFKsuer9/giphy.gif?cid=ecf05e47xdyrn6x25g4sdbnd0lp5jzza868lsxrwhjqtdft5&rid=giphy.gif&ct=g')
            .addField(`Duration: `, ms(ms(time)))
            .setFooter('Click on the 🎲 to participate.')
            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
            .setTimestamp();

        let sendEmbed = await message.channel.send(Embed);
        sendEmbed.react('🎲');

        setTimeout(async () => {
            try {
                const peopleReactedBot = await sendEmbed.reactions.cache.get("🎲").users.fetch();
                var peopleReacted = peopleReactedBot.array().filter(u => u.id !== client.user.id);
            } catch (e) {
                return message.channel.send(`I fucked up: ${e}`)
            }
            if (peopleReacted.length <= 0) {
                const EmbedNoJoin = new MessageEmbed()
                .setColor(0x45150d)
                .setTitle(`${message.author.username} has iniated a roll!`)
                .setDescription(`Nobody joined the roll ${item ? 'for a ' + item : ''}. Roll ended`)
                .addField(`Duration: `, `Roll has ended`)
                .setFooter('The roll has ended you can no longer participate')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                .setTimestamp();

                sendEmbed.edit(EmbedNoJoin)
            } else {
                for(let i = 0; i < peopleReacted.length; i++) {
                    participants.push({ user: peopleReacted[i], roll: Math.floor(Math.random() * 100) + 1})
                }

                let highestRoll = Math.max(...participants.map(participant => participant.roll));
                let winner = participants.find(participant => participant.roll === highestRoll);

                const EmbedWinner = new MessageEmbed()
                .setColor(0x45150d)
                .setTitle(`${message.author.username} has iniated a roll!`)
                .setDescription(item ? `${winner.user.username} has won a ${item}!` : `${winner.user.username} has won!`)
                .setImage("https://cdn.discordapp.com/avatars/"+winner.user.id+"/"+winner.user.avatar+".jpeg")
                .addField(`Duration: `, `Roll has ended`)
                .setFooter('The roll has ended you can no longer participate')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                .setTimestamp();

                for(let i = 0; i < participants.length; i++) {
                    EmbedWinner.addField(`${participants[i].user.username}: `, `${participants[i].roll}`)
                }

                sendEmbed.edit(EmbedWinner)
            }
        }, ms(time));
    }
}