import { ActivityType } from "discord.js";
import { client } from "..";
import { Event } from "@/structures/event";
import { birthdayCron } from "@/cronjobs/birthdayCron";
import { hotdCron } from "@/cronjobs/hotdCron";

export default new Event("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
  client.user!.setActivity({
    name: "I am your shield... I am your sword.",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=t-T6lEYJHm8",
  });
  
  const fetchHiscores = client.commands.get("fetchhiscores");
  
  if (fetchHiscores) {
    fetchHiscores.run({ client: client, args: null });
    
    // 5 minutes
    setInterval(function () {
      fetchHiscores.run({ client: client, args: null });
    }, 300000);
  }
  
  birthdayCron.start();
  hotdCron.start();
});
