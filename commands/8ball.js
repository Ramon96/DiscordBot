module.exports = {
    name: "8ball",
    description: "Gives advise",
    execute(message) {
        const answers = ['yes', 'no', 'maybe']
        let roll = Math.floor(Math.random() * 3);
        message.reply(answers[roll]);
    }
}