require('dotenv').config({});
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    // TODO: write a switch case for this shit
    if(msg.content.startsWith(`${process.env.prefix}Game and watch`)){
         let rng = Math.floor(Math.random() * 9 ) + 1;
        if (rng == 9){
            let victim = msg.member;
            // je bent de lul
            msg.reply("The hammer rolled a " + rng + ". Get fucked!");

            victim.kick("The hammer rolled a 9.")
            .then(()=> console.log("succes"))
            .catch(console.error);
            msg.channel.send("Beep!", {file:"https://www.ssbwiki.com/images/thumb/a/a3/GameWatchSide2-SSB4.png/200px-GameWatchSide2-SSB4.png"})
        }
        else{
            msg.reply("You have been hit by a " + rng);
            msg.channel.send("Beep!", {file:"https://www.ssbwiki.com/images/thumb/e/ec/GameWatchSide1-SSB4.png/200px-GameWatchSide1-SSB4.png"})
        }

    }
    else if(msg.content.startsWith(`${process.env.prefix}Homey`)){
        msg.channel.send("Ohh Homeeyyy ", {tts:true});
    }
});

client.login(process.env.token);