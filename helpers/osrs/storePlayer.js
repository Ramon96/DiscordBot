const hiscores = require('osrs-json-hiscores');
const Player = require('../../model/osrs');

async function storePlayer(rsn, mention){
    return await hiscores.getStats(rsn)
    .then(res => {
        // TODO check of de speler niet al in de highscore staat xd
        const player = new Player({
            discordId: mention,
            osrsName: rsn,
            stats: res.main.skills
        })
        player.save()
        .then(result => {
            return true
        })
        .catch(err => {
            console.error(err)
        })
    })
    .catch(err => {
        console.error(err)
        return false
    })
}

module.exports = storePlayer;