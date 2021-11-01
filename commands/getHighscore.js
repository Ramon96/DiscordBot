const { MessageEmbed } = require('discord.js');
const hiscores = require('osrs-json-hiscores');
const Player = require('../model/osrs');
const compare = require('../helpers/compare');
const _ = require('lodash');
const osrsSkills = {
    attack: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Attack_cape_emote.gif/200px-Attack_cape_emote.gif?ca355',
        color: 0x9B2007
    },
    defence: {
        gif: 'https://oldschool.runescape.wiki/images/Defence_cape_emote.gif?fc8fe',
        color: 0x6277BE
    },
    strength: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Strength_cape_emote.gif/190px-Strength_cape_emote.gif?62d1a',
        color: 0x04955A
    },
    hitpoints: {
        gif: 'https://oldschool.runescape.wiki/images/Hitpoints_cape_emote.gif?8f71c',
        color: 0x837E7E
    },
    ranged: {
        gif: 'https://oldschool.runescape.wiki/images/Ranging_cape_emote.gif?566b2',
        color: 0x6D9017
    },
    magic: {
        gif: 'https://oldschool.runescape.wiki/images/Magic_cape_emote.gif?79885',
        color: 0x3250C1
    },
    cooking: {
        gif: 'https://oldschool.runescape.wiki/images/Cooking_cape_emote.gif?f45fd',
        color: 0x702386
    },
    prayer: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Prayer_cape_emote.gif/130px-Prayer_cape_emote.gif?4ba50',
        color: 0x9F9323
    },
    woodcutting: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Woodcutting_cape_emote.gif/160px-Woodcutting_cape_emote.gif?1b924',
        color: 0x348C25
    },
    fletching: {
        gif: 'https://oldschool.runescape.wiki/images/Fletching_cape_emote.gif?c6c6f',
        color: 0x038D7D
    },
    fishing: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Fishing_cape_emote.gif/190px-Fishing_cape_emote.gif?41d0c',
        color: 0x6A84A4
    },
    firemaking: {
        gif: 'https://oldschool.runescape.wiki/images/Firemaking_cape_emote.gif?5c8a5',
        color: 0xBD7819
    },
    crafting: {
        gif: 'https://oldschool.runescape.wiki/images/Crafting_cape_emote.gif?9d103',
        color: 0x976E4D
    },
    smithing: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Smithing_cape_emote.gif/190px-Smithing_cape_emote.gif?cb6e1',
        color: 0x6C6E4D
    },
    mining: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Mining_cape_emote.gif/180px-Mining_cape_emote.gif?df949',
        color: 0x5D8FA7
    },
    herblore: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Herblore_cape_emote.gif/190px-Herblore_cape_emote.gif?5e829',
        color: 0x078509
    },
    agility: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Agility_cape_emote.gif/190px-Agility_cape_emote.gif?3af39',
        color: 0x3A3C89
    },
    thieving: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Thieving_cape_emote.gif/190px-Thieving_cape_emote.gif?44d24',
        color: 0x6C3457
    },
    slayer: {
        gif: 'https://oldschool.runescape.wiki/images/Slayer_cape_emote.gif?82a25',
        color: 0x646464
    },
    farming: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Farming_cape_emote.gif/190px-Farming_cape_emote.gif?16a65',
        color: 0x65983F
    },
    runecraft: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Runecraft_cape_emote.gif/190px-Runecraft_cape_emote.gif?ba5a9',
        color: 0xAA8D1A
    },
    hunter: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Hunter_cape_emote.gif/190px-Hunter_cape_emote.gif?d736a',
        color: 0x5C5941
    },
    construction: {
        gif: 'https://oldschool.runescape.wiki/images/thumb/Construction_cape_emote.gif/190px-Construction_cape_emote.gif?c2bae',
        color: 0x82745F
    }
}

module.exports = {
    name: "highscore",
    description: "fetches the highscores and compares the levels stored in the database with the highscore data. if there are level increases the player will be congratiolated and the new data will be saved.",
    execute(channel, client) {
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
                                                    const Embed = new MessageEmbed()
                                                    .setColor(osrsSkills[skill].color)
                                                    .setTitle(`**${_.startCase(username)} has advanced his ${skill}!**`)
                                                    .setDescription((levelups > 1) ? `${client.users.cache.get(docs[item].discordId)} has gained a total of ${levelups} level ups!` : `${client.users.cache.get(docs[item].discordId)} has gained 1 level!`)
                                                    .setImage(osrsSkills[skill].gif)
                                                    .setTimestamp();

                                                    channel.send(Embed);
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