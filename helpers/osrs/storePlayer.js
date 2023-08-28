const hiscores = require("osrs-json-hiscores");
const Player = require("../../model/osrs");

async function storePlayer(rsn, mention) {
  return await hiscores
    .getStats(rsn)
    .then((res) => {
      // check if player exists

      if (Player.exists({ discordId: mention, osrsName: rsn.toLowerCase() })) {
        return false;
      }

      const player = new Player({
        discordId: mention,
        osrsName: rsn.toLowerCase(),
        stats: res.main.skills,
      });
      player
        .save()
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

module.exports = storePlayer;
