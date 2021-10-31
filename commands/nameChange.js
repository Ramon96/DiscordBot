const hiscores = require('osrs-json-hiscores');
const Player = require('../model/osrs');

module.exports = {
    name: "namechange",
    description: "changes the name in the database. use !namechange <old username> <new username>",
    execute(message, msg) {
        const prefix = process.env.prefix + 'namechange';
        const args = message.slice(prefix.length + 1).split(' ');
        const rsnold = args[0];
        const rsnnew = args[1];
        hiscores.getStats(rsnnew)
        .then(res => {
            Player.findOne({osrsName: rsnold})
            .then(doc => {
                doc.osrsName = rsnnew;
                doc.markModified('osrsName');
                doc.save();
                msg.reply(`Changed username to ${rsnnew}`)
            })
            .catch(err => {
                msg.reply(`${rsnold} was not found in the collection.`)
            })
        })
        .catch(err => {
            msg.reply(`${rsnnew} was not found in the hiscores.`)
        })
    }
}