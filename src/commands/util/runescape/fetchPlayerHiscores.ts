import hiscores from "osrs-json-hiscores";
import {FetchStats} from "../../../typings/runescape";
import {IPlayer} from "../../../models/osrs-schema";


export async function fetchPlayerHiscores (players: IPlayer[]): Promise<FetchStats[]> {
    let stats = [];
    
    for (const player of players) {
        const fetchedStats = await hiscores.getStats(player.osrsName)
            .then((res) => res.main)
            .catch((err) => {
                console.error(err);
                return null;
            });
        
        if (!fetchedStats) {
            console.info(`${player.osrsName} not found on hiscores`);
            continue;
        }

        stats.push({
            [player.osrsName]: fetchedStats
        });
    }
    
    return stats;
}