import * as cron from "cron";
import { UserSchema } from "../models/user";
import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "..";

export const birthdayCron = new cron.CronJob("00 00 00 * * *", function () {
  UserSchema.find({})
    .exec()
    .then((document) => {
      document.forEach((user) => {
        const birthday = user.birthday;
        const today = new Date();
        const birthdayDate = new Date(birthday);
        if (
          today.getDate() === birthdayDate.getDate() &&
          today.getMonth() === birthdayDate.getMonth()
        ) {
          const embed = new EmbedBuilder();
          embed.setTitle("Happy birthday!");
          embed.setDescription(`Happy birthday <@${user.id}>!`);
          embed.setImage(
            "https://media2.giphy.com/media/KdC9XVrVYOVu6zZiMH/giphy.gif?cid=ecf05e472frr6makwkfx3huoqftm8x5malnq3l6um6xn7csx&rid=giphy.gif&ct=g"
          );
          embed.setColor("#FF0000");
          embed.setTimestamp();

          const channel = client.channels.cache.get(
            "872200569257873458"
          ) as TextChannel;

          if (!channel) return console.log("Channel not found");

          channel.send({ embeds: [embed] });
        }
      });
    });
});
