import { ActivityType } from "discord.js";
import { client } from "..";
declare module "discord.js" {
  interface Client {
    fetchHiscoresInterval?: NodeJS.Timeout;
  }
}
import { birthdayCron } from "../cronjobs/birthdayCron";
import { hotdCron } from "../cronjobs/hotdCron";
import { Event } from "../structures/event";

export default new Event("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
  client.user!.setActivity({
    name: "I am your shield... I am your sword.",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=t-T6lEYJHm8",
  });

  const fetchHiscores = client.commands.get("fetchhiscores");
  const minute = 60000;

  // Clear bestaande interval als die er is
  if (client.fetchHiscoresInterval) {
    clearInterval(client.fetchHiscoresInterval);
    client.fetchHiscoresInterval = undefined;
  }

  if (fetchHiscores) {
    fetchHiscores.run({ client: client, args: null });

    client.fetchHiscoresInterval = setInterval(function () {
      fetchHiscores.run({ client: client, args: null });
    }, minute * 30);
  }

  birthdayCron.start();
  hotdCron.start();
});
