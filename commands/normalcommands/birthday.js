const {
    MessageEmbed
} = require('discord.js');
const cron = require('cron');
const validateDate = require('../../helpers/functions/validateDate');
const storeUser = require('../../helpers/functions/storeUser');
const User = require('../../model/discordUser');

module.exports = {
    name: "birthday",
    description: "check birthay, gz when there is one",
    execute(client, message) {

        if (message) {
            const prefix = process.env.prefix + 'birthday';
            const birthday = message.content.slice(prefix.length + 1).split(' ').toString();
            const userId = message.author.id;

            if (validateDate(birthday)) {
                storeUser(userId, birthday)
                    .then(res => {
                        console.log(res)
                        if (res === true) message.reply('Birthday stored!');
                        else message.reply('Birthday already stored!');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else return message.reply('please enter a valid date in the format dd/mm/yyyy');
        }

        let dailymessage = new cron.CronJob('00 00 00 * * *', function () {
            User.find()
            .exec()
            .then(docs => {
                docs.forEach(doc => {
                    let birthday = doc.birthday;
                    let userId = doc.id;
                    let user = client.users.cache.get(userId);
                    let today = new Date();
                    let birthdayDate = new Date(convertDate(birthday));
                    let age = today.getFullYear() - birthdayDate.getFullYear();

                    if (birthdayDate.getDate() == today.getDate() && birthdayDate.getMonth() == today.getMonth()) {
                        let embed = new MessageEmbed()
                            .setTitle('Happy Birthday!')
                            .setDescription(`${user} is ${age} jaar!`)
                            .setThumbnail(user.avatarURL())
                            .setColor('#ff0000')
                            .setImage('https://media2.giphy.com/media/KdC9XVrVYOVu6zZiMH/giphy.gif?cid=ecf05e472frr6makwkfx3huoqftm8x5malnq3l6um6xn7csx&rid=giphy.gif&ct=g')
                            .setTimestamp();
                        client.channels.cache.get('867074325824012382').send({embeds: [embed]});
                    }
                });
            })
        });
        dailymessage.start();
    }
}


function convertDate(date) {
    const dateArray = date.split('-');
    const day = dateArray[0];
    const month = dateArray[1];
    const year = dateArray[2];
    return `${year}-${month}-${day}`;
}