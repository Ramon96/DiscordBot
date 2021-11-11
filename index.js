require('dotenv').config({});
const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: new Discord.Intents(Discord.Intents.ALL) }});
const mongoose = require('mongoose');
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
    client.commands.get('highscore').execute(client.channels.cache.get('872200569257873458'), client);

    // 5 minutes
    setInterval(function() {
        client.commands.get('highscore').execute(client.channels.cache.get('872200569257873458'), client);
    },  300000)
    client.commands.get('dailymessage').execute(client);
    client.commands.get('birthday').execute(client);
});

client.on('message', msg => {
    let message = msg.content.toLowerCase();
    // TODO aliases

    if (message.startsWith(`${process.env.prefix}game and watch`)) {
        client.commands.get('rng').execute(msg);
    } 
    else if (message.startsWith(`${process.env.prefix}homey`)) {
        client.commands.get('homey').execute(msg);
    } 
    else if (message.startsWith(`${process.env.prefix}roll`)) {
        client.commands.get('roll').execute(msg, client);
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
        client.commands.get('highscore').execute(client.channels.cache.get('872200569257873458'), client);
        msg.delete({ timeout: 100 });
    }
    else if (message.startsWith(`${process.env.prefix}add`)) {
        client.commands.get('add').execute(message, msg);
    }
    else if (message.startsWith(`${process.env.prefix}namechange`)) {
        client.commands.get('namechange').execute(message, msg);
    }
    else if(message.startsWith(`${process.env.prefix}guide`)){
        client.commands.get('guide').execute(msg);
    }
    else if (message.includes('maplestory') || message.includes('maple') || message.includes('mesos')) {
        msg.author.send('Mesos pl0x');
    }
    else if (message.startsWith(`${process.env.prefix}play`) || message.startsWith(`${process.env.prefix}stop`) || message.startsWith(`${process.env.prefix}skip`)) {
        client.commands.get('music').execute(msg);
    }
    else if (message.includes('lik me') || message.includes('lik mijn')) {
        msg.reply('👅 💦🌰')
    }
    else if(message.startsWith(`${process.env.prefix}poll`)){
        client.commands.get('poll').execute(msg);
    }
    else if(message.startsWith(`${process.env.prefix}daily`)){
        client.commands.get('dailymessage').execute(client, msg);
    }
    else if(message.startsWith(`${process.env.prefix}birthday`)){
        client.commands.get('birthday').execute(client, msg);
    }
    else if (message.includes('daniel') || message.includes('daan') || message.includes('ramon') || message.includes('julian') || message.includes('boyes')) {
        client.commands.get('boyes').execute(msg);
    }
});

// When someone joined or left a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (oldMember.channelID === null) {
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
});

client.login(process.env.token);