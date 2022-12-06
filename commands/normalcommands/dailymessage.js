const { MessageEmbed } = require('discord.js');
const cron = require('cron');

module.exports = {
    name: "dailymessage",
    description: "sends a daily message giving a random hotty of the day",
    execute(client, message) {
        const hotties = [
            "291296782187495424", 
            '424641375372443654',
            '248857813475000320', 
            '294200096763936769', 
            '131124125996548096',
            '275998536162738179',
        ]

        if (message) {
            const guild = client.guilds.cache.get('867074325824012379');
            let user = guild.members.cache.random().user;
            message.delete({ timeout: 100 }).catch(console.error);

            while(hotties.includes(user.id) == false){
                user = guild.members.cache.random().user;
            }
            
            const Embed = new MessageEmbed()
            .setColor(0xff496c)
            .setTitle(`**Hottie of the day!**`)
            .setDescription(`Todays hottie of the day is ${user.username}`)
            .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`)
            .setTimestamp();
            client.channels.cache.get('867074325824012382').send({embeds: [Embed]});
        }

        let dailymessage = new cron.CronJob('00 00 11 * * *', () => {
            const guild = client.guilds.cache.get('867074325824012379');
            let user = guild.members.cache.random().user;

            while(hotties.includes(user.id) == false){
                user = guild.members.cache.random().user;
            }
            
            const Embed = new MessageEmbed()
            .setColor(0xff496c)
            .setTitle(`**Hottie of the day!**`)
            .setDescription(`Todays hottie of the day is ${user.username}`)
            .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`)
            .setTimestamp();
            client.channels.cache.get('867074325824012382').send({embeds: [Embed]});
        });

        dailymessage.start();
    }
}

