const storePlayer = require('../helpers/osrs/storePlayer');

module.exports = {
    name: "add",
    description: "Adds an player to the database. use !add <osrs name> @mention",
    execute(message, msg) {
        const prefix = process.env.prefix + 'osrs';
        const args = message.slice(prefix.length).split(' ');
        const rsn = args[0];
        const mention = msg.mentions.users.first();
        if(!msg.mentions.users.size){
            return msg.reply('Mention was missing.')
        }

        if(!rsn){
            return msg.reply('Runescape name was missing.')
        }

        storePlayer(rsn, mention.id)
        .then(res =>{
            if(res == false){
                msg.reply("Runescape username was not found in the highscores, use '_' for spaces in your username")
            }
            else{
                msg.reply(`${rsn} was succesfully added to the collection.`)
            }
        })
    }
}