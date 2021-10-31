require('dotenv').config({});
const Discord = require('discord.js');
const client = new Discord.Client();
const hiscores = require('osrs-json-hiscores');
const _ = require('lodash');
const mongoose = require('mongoose');
const Player = require('./model/osrs');
const { result } = require('lodash');
const fs = require('fs');
client.commands = new Discord.Collection();

commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

mongoose.connect(`mongodb+srv://admin:${process.env.mongoose}@osrsboys.rc9hb.azure.mongodb.net/test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
    let message = msg.content.toLowerCase();

    if (message.startsWith(`${process.env.prefix}game and watch`)) {
        client.commands.get('rng').execute(msg);
    } 
    else if (message.startsWith(`${process.env.prefix}homey`)) {
        client.commands.get('homey').execute(msg);
    } 
    else if (message.startsWith(`${process.env.prefix}roll`)) {
        client.commands.get('roll').execute(msg);
    } 
    else if (message.startsWith(`${process.env.prefix}mhw`)) {
        client.commands.get('mhw').execute(msg);
    } 
    else if (message.includes(process.env.triggerword1) || message.includes(process.env.triggerword2)) {
        client.commands.get('badword').execute(msg);
    }
    else if (message.startsWith(`${process.env.prefix}magische schelp`)) {
        client.commands.get('8ball').execute(msg);
    } 
    else if (message.startsWith(`${process.env.prefix}osrs`)) {
        getHiscore();
    }
    else if (message.startsWith(`${process.env.prefix}add`)) {
        client.commands.get('add').execute(message, msg);
    }
    else if (message.startsWith(`${process.env.prefix}namechange`)) {
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
                    console.log(args)
                console.log("old" + rsnold)
                console.log("new" + rsnnew)
                    msg.reply(`${rsnold} was not found in the collection.`)
                })
            })
            .catch(err => {
                msg.reply(`${rsnnew} was not found in the hiscores.`)
            })
    }
    else if(message.startsWith(`${process.env.prefix}guide`)){
        client.commands.get('guide').execute(msg);
    }
});

// When someone joined or left a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    // user joins a channel
    if (oldMember.channelID === null) {
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
});


client.login(process.env.token);



function getHiscore() {
// Get all the players from the database
    Player.find()
        .exec()
        .then(docs => {
            // console.log(docs)
            Object.keys(docs).forEach(async function(item){
                // console.log(docs[item].osrsName)
                   await hiscores.getStats(docs[item].osrsName)
                        .then(async res => {
                                // Compare the new stats with the old
                                const changes = compare(docs[item].stats, res.main.skills)
                                const username = docs[item].osrsName.replace(new RegExp('_', 'g'), ' ')
                                if (!_.isEmpty(changes)) { 
                                    for(let skill in changes){
                                        if(changes[skill].hasOwnProperty("level") && skill !== "overall"){
                                            if(docs[item].stats[skill].level < changes[skill].level){
                                                const levelups = changes[skill].level - docs[item].stats[skill].level;
                                                await Player.findOne({_id: docs[item].id})
                                                .then(async doc => {
                                                    doc.stats[skill] = changes[skill]
                                                    doc.markModified('stats')
                                                    await doc.save();
                                                })
                                                .then(() => {
                                                    client.channels.cache.get('872200569257873458').send(`Gz <@${docs[item].discordId}>, ${_.startCase(username)} gained a total of ${levelups} level(s) and now has ${changes[skill].level} ${skill}!`)
                                                })
                                                .catch(err => console.log(err))
                                            }
                                        }
                                    }

                                }
                                else{
                                    console.log('no changes')
                                }
                            
                            // Save the new aquired stats
                            // osrsObject[item].stats = res.main.skills

                        })
                })
                // docs.save();
        })
        .catch(err => console.log(err))
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