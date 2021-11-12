module.exports = {
    name: "badword",
    description: "Reacts to a bad word with an emoji",
    execute(message) {
        const shanoW = message.guild.emojis.cache.find(emoji => emoji.name == "shanoW");
        message.react(shanoW);
    }
}