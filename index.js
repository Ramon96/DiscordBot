require('dotenv').config({});
const Discord = require('discord.js');
const client = new Discord.Client();
const hiscores = require('osrs-json-hiscores');
const _ = require('lodash');

const osrsObject = {
    Ramon: {
        discordId: 294200096763936769,
        osrsName: "Bijlmer",
        stats: []
    },
    Daan2: {
        discordId: 291296782187495424,
        osrsName: "Crag Goblin",
        stats: []
    },
    Julian: {
        discordId: 275998536162738179,
        osrsName: "vKooten",
        stats: []
    },
    Daan: {
        discordId: 131124125996548096,
        osrsName: "Drakendoder",
        stats: []
    },
    Matthee: {
        discordId: 285843924298498050,
        osrsName: "M CG",
        stats: []
    }
}

// const osrsObject2 = {
//     Ramon: {
//         discordId: 294200096763936769,
//         osrsName: "Bijlmer2",
//         stats: []
//     },
//     Daan2: {
//         discordId: 291296782187495424,
//         osrsName: "Cringe Guard",
//         stats: []
//     },
//     Julian: {
//         discordId: 275998536162738179,
//         osrsName: "vKooten",
//         stats: []
//     },
//     Daan: {
//         discordId: 131124125996548096,
//         osrsName: "Drakendoder",
//         stats: []
//     },
//     Matthee: {
//         discordId: 285843924298498050,
//         osrsName: "M CG",
//         stats: []
//     }
// }

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    storeStats();

    // Finding user id's
    // console.log(client.users.find("username", "MCG"))
});

client.on('message', msg => {
    // TODO: write a switch case for this shit
    let message = msg.content.toLowerCase();
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

    } else if (message.startsWith(`${process.env.prefix}homey`)) {
        msg.channel.send("Ohh Homeeyyy ", {
            tts: true
        });
    } else if (message.startsWith(`${process.env.prefix}roll`)) {
        let roll = Math.floor(Math.random() * 100) + 1;
        msg.reply(" has rolled " + roll);
    } else if (message.startsWith(`${process.env.prefix}mhw`)) {
        const weaponCategories = ["Sword and Shield", "Great Sword", "Dual Blades", "Long Sword", "Hammer", "Hunting Horn", "Lance", "Gunlance", "Switch Axe", "Charge Blade", "Insect Glaive", "Bow", "Light Bowgun", "Heavy Bowgun"]

        msg.reply(" Should go for the " + weaponCategories[Math.floor(Math.random() * weaponCategories.length)]);
    } else if (message.includes(process.env.triggerword1) || message.includes(process.env.triggerword2)) {
        // Bad word filter
        const shanoW = client.emojis.find(emoji => emoji.name == "shanoW");
        msg.react(shanoW);
    } else if (message.startsWith(`${process.env.prefix}osrs`)) {
        const prefix = process.env.prefix + 'osrs';
        // const givenUsername = message.slice(prefix.length + 1).split(' ');



    }
    else if (message.startsWith(`${process.env.prefix}give`)) {
        // const prefix = process.env.prefix + 'give';
        // const givenUsername = message.slice(prefix.length + 1).split(' ');

        // console.log(osrsObject.Ramon.stats)
        // console.log(difference(osrsObject2, osrsObject))

        compareStats()
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        //julians id
        if (newMember.id == 275998536162738179) {
            newMember.guild.systemChannel.send("Hallo" + " <@131124125996548096>, Julian is in de discord server.");
        }
    } else if (newUserChannel === undefined) {
        // user leaves
    }
});


client.login(process.env.token);

function storeStats(){
    Object.keys(osrsObject).forEach(function (item) {
        // console.log(osrsObject[item].osrsName)
        hiscores.getStats(osrsObject[item].osrsName)
            .then(res => {
                // console.log(res.main.skills)
                osrsObject[item].stats = res.main.skills
            })
            .then(() =>{
                console.log("stored the player stats")
            })
    })
}

function compareStats(){
    Object.keys(osrsObject).forEach(function (item) {
        hiscores.getStats(osrsObject[item].osrsName)
            .then(res => {
                // osrsObject[item].stats = res.main.skills

                // hoe krijg ik het voor elkaar om alleen een bericht te krijgen als het level anders is en niet de rank of exp
                osrsObject[item].stats.woodcutting.level = 72; // for testing so we can see if we get this returned
                console.log('differnce in: ' + osrsObject[item].osrsName)
                console.log(difference(osrsObject[item].stats, res.main.skills))
            })
    })
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
		return _.transform(object, function(result, value, key) {
			if (!_.isEqual(value, base[key])) {
				result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(object, base);
}