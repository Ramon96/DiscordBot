require('dotenv').config({});
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    // TODO: write a switch case for this shit
    let message = msg.content.toLowerCase();
    if(message.startsWith(`${process.env.prefix}game and watch`)){
         let rng = Math.floor(Math.random() * 9 ) + 1;
        if (rng == 9){
            let victim = msg.member;
            msg.reply("The hammer rolled a " + rng + ". Get fucked!");
            msg.channel.send("Beep!", {file:"https://www.ssbwiki.com/images/thumb/a/a3/GameWatchSide2-SSB4.png/200px-GameWatchSide2-SSB4.png"})

            setTimeout(function(){
                victim.kick("The hammer rolled a 9.")
                .then(()=> console.log("succes"))
                .catch(console.error);
            }, 3000)
        }
        else{
            msg.reply("You have been hit by a " + rng);
            msg.channel.send("Beep!", {file:"https://www.ssbwiki.com/images/thumb/e/ec/GameWatchSide1-SSB4.png/200px-GameWatchSide1-SSB4.png"})
        }

    }
    else if(message.startsWith(`${process.env.prefix}homey`)){
        msg.channel.send("Ohh Homeeyyy ", {tts:true});
    }
    else if(message.startsWith(`${process.env.prefix}roll`)){
        let roll = Math.floor(Math.random() * 100 ) + 1;
        msg.reply(" has rolled " + roll);
    }
    else if(message.startsWith(`${process.env.prefix}mhw`)){
        const weaponCategories = ["Sword and Shield", "Great Sword", "Dual Blades", "Long Sword", "Hammer", "Hunting Horn", "Lance", "Gunlance", "Switch Axe", "Charge Blade", "Insect Glaive", "Bow", "Light Bowgun", "Heavy Bowgun"]
        let chosenWeapon = Math.floor(math.random() * weaponCategories.length) + 1

        msg.reply(" Should go for the" + chosenWeapon);
    }
    else if(message.includes("nigger") || message.includes("neger")){
        // Bad word filter
        const shanoW = client.emojis.find(emoji => emoji.name == "shanoW");
        msg.react(shanoW);
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    if (oldUserChannel === undefined && newUserChannel !== undefined){
        //julians id
        if(newMember.id == 275998536162738179){
            newMember.guild.systemChannel.send("Hallo" + " <@131124125996548096>, Julian is in de discord server." );
        }
    }
    else if(newUserChannel === undefined){
        // user leaves
    }
});



client.login(process.env.token);