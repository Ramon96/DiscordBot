import { client } from "..";
import { Event } from "../structures/event";
import { TextChannel } from "discord.js";

export default new Event("voiceStateUpdate", async (oldState, newState) => {
  // if the user joined a voice channel
  if (oldState.channel === null && newState.channel !== null) {
    // check the user id to see who joined
    if (newState.member.id === "291296782187495424") {
      // write a message in the general channel if Daniel joined.
      const channel = client.channels.cache.get(
        "867074325824012382"
      ) as TextChannel;

      if (!channel) return console.log("Channel not found");

      channel.send({
        content: "Kijk eens wie er uit zijn hol is gekropen! XD",
        tts: true,
      });
    }
  }
});
