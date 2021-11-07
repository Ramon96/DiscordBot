const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "8ball",
    description: "Gives advise",
    execute(message) {
        const prefix = process.env.prefix + 'magischeschelp';
        const args = message.content.slice(prefix.length + 1).split(' ');
        let messageArgs = args.slice(1).join(" ");
        const answers = ['yes', 'no', 'maybe']
        let roll = Math.floor(Math.random() * answers.length);

        const Embed = new MessageEmbed()
            .setColor(0x0457A0)
            .setTitle(`${message.author.username}: ${messageArgs}`)
            .setDescription(`🦪: **${answers[roll]}**`)
            .setImage('https://tenor.com/view/magic-conch-spongebob-pulling-string-magic-conch-shell-pull-gif-16295324');

        message.channel.send(Embed).then(() => {
            message.delete({ timeout: 1000 }).catch(console.error);
        });
    }
}