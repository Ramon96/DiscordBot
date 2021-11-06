const { MessageEmbed } = require('discord.js');
const cron = require('cron');

module.exports = {
    name: "dailymessage",
    description: "sends a daily message giving a random hotty of the day",
    execute(client, message) {

        if (message) {
            const guild = client.guilds.cache.get('867074325824012379');
            const user = guild.members.cache.random().user;
            message.delete({ timeout: 100 }).catch(console.error);

            while(user.id === '675080598355705899'){
                user = guild.members.cache.random().user;
            }
            
            const Embed = new MessageEmbed()
            .setColor(0xff496c)
            .setTitle(`**Hottie of the day!**`)
            .setDescription(`Todays hottie of the day is ${user.username}`)
            .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`)
            .setTimestamp();
            client.channels.cache.get('867074325824012382').send(Embed);
        }

        let dailymessage = new cron.CronJob('00 00 11 * * *', () => {
            const guild = client.guilds.cache.get('867074325824012379');
            const user = guild.members.cache.random().user;

            while(user.id === '675080598355705899'){
                user = guild.members.cache.random().user;
            }
            
            const Embed = new MessageEmbed()
            .setColor(0xff496c)
            .setTitle(`**Hottie of the day!**`)
            .setDescription(`Todays hottie of the day is ${user.username}`)
            .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`)
            .setTimestamp();
            client.channels.cache.get('867074325824012382').send(Embed);
        });

        dailymessage.start();
    }
}

