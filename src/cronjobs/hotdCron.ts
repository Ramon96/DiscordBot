import * as cron from "cron";
import { HottieSchema } from "@/models/hottie";
import { client } from "..";
import { EmbedBuilder, TextChannel } from "discord.js";

export const hotdCron = new cron.CronJob("00 00 11 * * *", () => {
  if (process.env.guildId === undefined)
    return console.log("Guild ID not found");

  const guild = client.guilds.cache.get(process.env.guildId);
  if (!guild) return console.log("Guild not found");
  let user = guild.members.cache.random()!.user;

  if (!user) return console.log("User not found");

  const whitelisted = [
    "291296782187495424",
    "424641375372443654",
    "248857813475000320",
    "294200096763936769",
    "131124125996548096",
    "275998536162738179",
  ];

  while (!whitelisted.includes(user.id)) {
    user = guild.members.cache.random()!.user;
  }

  HottieSchema.findOne({ id: user.id }).then(async (document) => {
    document!.count += 1;
    document!.markModified("count");
    await document!.save();
  });

  const embed = new EmbedBuilder()
    .setColor(0xff496c)
    .setTitle(`**Hottie of the day!**`)
    .setDescription(`Todays hottie of the day is ${user.username}`)
    .setImage(
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
    )
    .setTimestamp();

  const channel = client.channels.cache.get(
    "867074325824012382"
  ) as TextChannel;

  if (!channel) return console.log("Channel not found");

  channel.send({ embeds: [embed] });
});
