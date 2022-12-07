const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const hiscores = require('osrs-json-hiscores');
const Player = require('../../model/osrs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("namechange")
        .addStringOption(option => option.setName("old_rsn").setDescription("Previous Runescape name. Use '_' for spaces in your username").setRequired(true))
        .addStringOption(option => option.setName("new_rsn").setDescription("New Runescape name. Use '_' for spaces in your username").setRequired(true))
        .setDescription("Name change your rsn in the database."),
    name: "namechange",
    execute(interaction) {
        const rsnold = interaction.options.getString("old_rsn");
        const rsnnew = interaction.options.getString("new_rsn");

        hiscores.getStats(rsnnew)
            .then(res => {
                Player.findOne({
                        osrsName: rsnold
                    })
                    .then(doc => {
                        doc.osrsName = rsnnew;
                        doc.markModified('osrsName');
                        doc.save();
                        msg.reply(`Changed username to ${rsnnew}`)
                    })
                    .catch(err => {
                        interaction.reply(`${rsnold} was not found in the collection.`)
                    })
            })
            .catch(err => {
                interaction.reply(`${rsnnew} was not found in the hiscores.`)
            })
    }
}