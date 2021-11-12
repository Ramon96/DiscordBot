const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rng")
    .setDescription("Rolls the dice between 1 - 9. Get kicked if the dice lands on 9"),
    name: "rng",
    execute(interaction) {
        let rng = Math.floor(Math.random() * 9) + 1;
        if (rng == 9) {
            let victim = interaction.user;
            interaction.reply("The hammer rolled a " + rng + ". Get fucked!");
            interaction.channel.send({
                files: ["https://www.ssbwiki.com/images/thumb/a/a3/GameWatchSide2-SSB4.png/200px-GameWatchSide2-SSB4.png"],
                content: "Beep!"
            })
            setTimeout(function () {
                victim.kick("The hammer rolled a 9.")
                    .then(() => console.log("succes"))
                    .catch(console.error);
            }, 3000)
        } else {
            interaction.reply("You have been hit by a " + rng);
            interaction.channel.send({
                content: "Beep!",
                files: ["https://www.ssbwiki.com/images/thumb/e/ec/GameWatchSide1-SSB4.png/200px-GameWatchSide1-SSB4.png"]
            })
        }
    }
}