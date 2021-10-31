const hiscores = require('osrs-json-hiscores');

async function storePlayer(rsn, mention){
    console.log('ik kom hier ' + rsn + ' ' + mention)
    return await hiscores.getStats(rsn)
    .then(res => {
        // todo check of de speler niet al in de highscore staat xd
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
            console.log(err)
        })
    })
    .catch(err => {
        return false
    })
}

module.exports = storePlayer;