const hiscores = require('osrs-json-hiscores');
const Player = require('../model/osrs');
const compare = require('../helpers/compare');
const _ = require('lodash');

module.exports = {
    name: "highscore",
    description: "fetches the highscores and compares the levels stored in the database with the highscore data. if there are level increases the player will be congratiolated and the new data will be saved.",
    execute(channel) {
        Player.find()
            .exec()
            .then(docs => {
                Object.keys(docs).forEach(async function (item) {
                    await hiscores.getStats(docs[item].osrsName)
                        .then(async res => {
                            // Compare the new stats with the old
                            const changes = compare(docs[item].stats, res.main.skills)
                            const username = docs[item].osrsName.replace(new RegExp('_', 'g'), ' ')
                            if (!_.isEmpty(changes)) {
                                for (let skill in changes) {
                                    if (changes[skill].hasOwnProperty("level") && skill !== "overall") {
                                        if (docs[item].stats[skill].level < changes[skill].level) {
                                            const levelups = changes[skill].level - docs[item].stats[skill].level;
                                            await Player.findOne({
                                                    _id: docs[item].id
                                                })
                                                .then(async doc => {
                                                    doc.stats[skill] = changes[skill]
                                                    doc.markModified('stats')
                                                    await doc.save();
                                                })
                                                .then(() => {
                                                    channel.send(`Gz <@${docs[item].discordId}>, ${_.startCase(username)} gained a total of ${levelups} level(s) and now has ${changes[skill].level} ${skill}!`)
                                                })
                                                .catch(err => console.log(err))
                                        }
                                    }
                                }
                            } else {
                                console.log('no changes')
                            }
                        })
                })
            })
            .catch(err => console.log(err))
    }
}