import hiscores from "osrs-json-hiscores";
import Player from "../../model/osrs";

async function storePlayer(rsn: string, mention: string) {
  return await hiscores
    .getStats(rsn)
    .then(async (res) => {
      const playerExists = await Player.exists({
        discordId: mention,
        osrsName: rsn.toLowerCase(),
      });

      if (playerExists) {
        return false;
      }

      const stats = res?.main?.skills || {};
      const player = new Player({
        discordId: mention,
        osrsName: rsn.toLowerCase(),
        stats,
      });
      try {
        await player.save();
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

export default storePlayer;
