module.exports = {
    name: "voiceStateUpdate",
    execute(client, oldMember, newMember) {
        if (oldMember.channelId === null) {
            // user joins a channel
            if (newMember.id == 275998536162738179) {
                client.channels.cache.get('867074325824012382').send("Hallo Daan, Julian is in de discord server.");
            }
            else if (newMember.id == 291296782187495424) {
                client.channels.cache.get('867074325824012382').send("Kijk daar heb je DANIEL XDDDDDDDDD.");
            }
            else if (newMember.id == 131124125996548096) {
                client.channels.cache.get('867074325824012382').send("Good to see you again, my king <@131124125996548096> o7");
            }
        } else if (newMember === null) {
            // user leaves
        }
    },
}