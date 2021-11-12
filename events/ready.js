module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

    client.commands.get('highscore').execute(client.channels.cache.get('872200569257873458'), client);

    // 5 minutes
    setInterval(function() {
        client.commands.get('highscore').execute(client.channels.cache.get('872200569257873458'), client);
    },  300000)
    client.commands.get('dailymessage').execute(client);
    client.commands.get('birthday').execute(client);
    },
}