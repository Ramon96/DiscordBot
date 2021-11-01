const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "poll",
    description: "lets the user vote with yes and no",
    execute(message) {
        const prefix = `${process.env.prefix}`;
        const args = message.content.substring(prefix.length).split(" ");

        switch (args[0]) {
            case "poll":

                const Embed = new MessageEmbed()
                    .setColor(0xFFC300)
                    .setTitle("Initiate Poll")
                    .setDescription('!poll voor een yes or no poll');

                if (!args[1]) {
                    message.channel.send(Embed);
                    break;
                }

                let messageArgs = args.slice(1).join(" ");

                message.channel.send(`🤔 **${messageArgs}**`).then(reaction => {
                    reaction.react('👍');
                    reaction.react('👎');
                    message.delete({ timeout: 1000 }).catch(console.error);
                });
                break;
        }
    }
}