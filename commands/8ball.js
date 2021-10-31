module.exports = {
    name: "8ball",
    description: "Gives advise",
    execute(message) {
        const answers = ['yes', 'no', 'maybe']
        let roll = Math.floor(Math.random() * answers.length);
        message.reply(answers[roll]);
    }
}