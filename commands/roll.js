module.exports = {
    name: "roll",
    description: "Lets the user roll between 1 and 100",
    execute(message) {
        let roll = Math.floor(Math.random() * 100) + 1;
        message.reply("has rolled " + roll);
    }
}