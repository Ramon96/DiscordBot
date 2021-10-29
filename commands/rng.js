module.exports = {
    name: "rng",
    description: "Rolls the dice between 1 - 9. The user gets kicked if the dice lands on 9",
    execute(message) {
        let rng = Math.floor(Math.random() * 9) + 1;
        if (rng == 9) {
            let victim = message.member;
            message.reply("The hammer rolled a " + rng + ". Get fucked!");
            message.channel.send("Beep!", {
                file: "https://www.ssbwiki.com/images/thumb/a/a3/GameWatchSide2-SSB4.png/200px-GameWatchSide2-SSB4.png"
            })

            setTimeout(function () {
                victim.kick("The hammer rolled a 9.")
                    .then(() => console.log("succes"))
                    .catch(console.error);
            }, 3000)
        } else {
            message.reply("You have been hit by a " + rng);
            message.channel.send("Beep!", {
                file: "https://www.ssbwiki.com/images/thumb/e/ec/GameWatchSide1-SSB4.png/200px-GameWatchSide1-SSB4.png"
            })
        }
    }
}