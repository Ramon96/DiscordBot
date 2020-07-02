require('dotenv').config({});
const Discord = require('discord.js');
const client = new Discord.Client();
const hiscores = require('osrs-json-hiscores');
const _ = require('lodash');

// I know this should be in an database, but I dont care :)
const osrsObject = {
    Ramon: {
        discordId: '294200096763936769',
        osrsName: "Bijlmer",
        stats: []
    },
    Daan2: {
        discordId: "291296782187495424",
        osrsName: "Crag Goblin",
        stats: []
    },
    Julian: {
        discordId: "275998536162738179",
        osrsName: "vKooten",
        stats: []
    },
    Matthee: {
        discordId: "285843924298498050",
        osrsName: "M CG",
        stats: []
    },
    Daan: {
        discordId: "131124125996548096",
        osrsName: "Drakendoder",
        stats: []
    },
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    // storeStats();
    getHiscore();
    // 5 minutes
    setInterval(getHiscore, 300000)
    // Finding user id's

    // console.log(client.users.find("username", "Yabby"))
    // console.log(client.channels.find("name", "general"))
});

client.on('message', msg => {
    // TODO: write a switch case for this shit
    let message = msg.content.toLowerCase();
    // Command that has a change that the user kicks himself.
    if (message.startsWith(`${process.env.prefix}game and watch`)) {
        let rng = Math.floor(Math.random() * 9) + 1;
        if (rng == 9) {
            let victim = msg.member;
            msg.reply("The hammer rolled a " + rng + ". Get fucked!");
            msg.channel.send("Beep!", {
                file: "https://www.ssbwiki.com/images/thumb/a/a3/GameWatchSide2-SSB4.png/200px-GameWatchSide2-SSB4.png"
            })

            setTimeout(function () {
                victim.kick("The hammer rolled a 9.")
                    .then(() => console.log("succes"))
                    .catch(console.error);
            }, 3000)
        } else {
            msg.reply("You have been hit by a " + rng);
            msg.channel.send("Beep!", {
                file: "https://www.ssbwiki.com/images/thumb/e/ec/GameWatchSide1-SSB4.png/200px-GameWatchSide1-SSB4.png"
            })
        }

    } 
    // Makes the bot say oh homey using text to speech
    else if (message.startsWith(`${process.env.prefix}homey`)) {
        msg.channel.send("Ohh Homeeyyy ", {
            tts: true
        });
    } 
    // Returns a random number between 1 and 100
    else if (message.startsWith(`${process.env.prefix}roll`)) {
        let roll = Math.floor(Math.random() * 100) + 1;
        msg.reply(" has rolled " + roll);
    } 
    // Suggegsts a Monster hunter class you should play
    else if (message.startsWith(`${process.env.prefix}mhw`)) {
        const weaponCategories = ["Sword and Shield", "Great Sword", "Dual Blades", "Long Sword", "Hammer", "Hunting Horn", "Lance", "Gunlance", "Switch Axe", "Charge Blade", "Insect Glaive", "Bow", "Light Bowgun", "Heavy Bowgun"]

        msg.reply(" Should go for the " + weaponCategories[Math.floor(Math.random() * weaponCategories.length)]);
    } 
    // Filter bad words.
    else if (message.includes(process.env.triggerword1) || message.includes(process.env.triggerword2)) {
        // Bad word filter
        const shanoW = client.emojis.find(emoji => emoji.name == "shanoW");
        msg.react(shanoW);
    } 
    // Check the highscores for level ups on oldschool runescape.
    else if (message.startsWith(`${process.env.prefix}osrs`)) {
        getHiscore();
    }
    else if (message.startsWith(`${process.env.prefix}yeet`)) {
        client.channels.get('321746940184363009').send(`yeet`)
    }
});

// When someone joined or left a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    // user joins a channel
    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        //if the user is julian
        if (newMember.id == 275998536162738179) {
            // notify daan that julian is on discord right now.
            newMember.guild.systemChannel.send("Hallo" + " <@131124125996548096>, Julian is in de discord server.");
        }
    } else if (newUserChannel === undefined) {
        // user leaves
    }
});


client.login(process.env.token);

function getHiscore() {

    //  Get the highscores for each player.
    Object.keys(osrsObject).forEach(function (item) {
        hiscores.getStats(osrsObject[item].osrsName)
            .then(res => {
                // if there where already some stats.
                if (!_.isEmpty(osrsObject[item].stats)) {
                    // Compare the new stats with the old
                    const changes = compare(osrsObject[item].stats, res.main.skills)
                    if (!_.isEmpty(changes)) {
                        Object.keys(changes).forEach(function (skill) {
                            if (changes[skill].hasOwnProperty("level")) {
                                client.channels.get('321746940184363009').send(`Gz <@${osrsObject[item].discordId}> with ${changes[skill].level} ${skill}!`)
                            }
                        })
                    }
                    else{
                        console.log('no changes')
                    }
                }
                // Save the new aquired stats
                osrsObject[item].stats = res.main.skills
            })
    })
}

function compare(oldSkills, newSkills) {
    const diff = difference(newSkills, oldSkills)
    return diff
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
// https://gist.github.com/Yimiprod/7ee176597fef230d1451
function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function (result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}