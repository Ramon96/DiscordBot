module.exports = {
    name: "homey",
    description: "Makes the bot say: ohh homeeyyy",
    execute(message) {
        message.channel.send("Ohh Homeeyyy ", {
            tts: true
        });
    }
}