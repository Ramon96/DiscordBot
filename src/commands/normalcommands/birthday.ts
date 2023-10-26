import { MessageEmbed } from "discord.js";
//@ts-ignore
import { CronJob } from "cron";
import validateDate from "../../helpers/functions/validateDate";
import storeUser from "../../helpers/functions/storeUser";
import discordUser from "../../model/discordUser";
import { Client, Message } from "discord.js";

export const name = "birthday";
export const description = "check birthay, gz when there is one";

export function execute(client: Client, message: Message) {
  if (message) {
    const prefix = process.env.prefix + "birthday";
    const birthday = message.content
      .slice(prefix.length + 1)
      .split(" ")
      .toString();
    const userId = message.author.id;

    if (validateDate(birthday)) {
      storeUser(userId, birthday)
        .then((res) => {
          console.log(res);
          if (res === true) message.reply("Birthday stored!");
          else message.reply("Birthday already stored!");
        })
        .catch((err) => {
          console.log(err);
        });
    } else
      return message.reply(
        "please enter a valid date in the format dd/mm/yyyy"
      );
  }

  let dailymessage = new CronJob("00 00 00 * * *", function () {
    discordUser
      .find()
      .exec()
      .then((docs) => {
        docs.forEach((doc) => {
          const birthday = doc.birthday;
          const userId = doc.id;
          const user = client.users.cache.get(userId);
          const today = new Date();
          const birthdayDate = new Date(convertDate(birthday));
          const age = today.getFullYear() - birthdayDate.getFullYear();

          if (
            birthdayDate.getDate() == today.getDate() &&
            birthdayDate.getMonth() == today.getMonth()
          ) {
            if (!user) return console.log("user not found");
            if (!user.avatarURL()) return console.log("user avatar not found");
            if (!client.channels.cache.get("1022102320575696906"))
              return console.log("channel not found");
            const embed = new MessageEmbed()
              .setTitle("Happy Birthday!")
              .setDescription(`${user} has reached ${age} age!`)
              .setThumbnail(user.avatarURL()!)
              .setColor("#ff0000")
              .setImage(
                "https://media2.giphy.com/media/KdC9XVrVYOVu6zZiMH/giphy.gif?cid=ecf05e472frr6makwkfx3huoqftm8x5malnq3l6um6xn7csx&rid=giphy.gif&ct=g"
              )
              .setTimestamp();
            const channel = client.channels.cache.get("1022102320575696906");
            if (channel?.isText()) {
              channel.send({ embeds: [embed] });
            } else {
              console.log("channel not found or is not a text channel");
            }
          }
        });
      });
  });
  dailymessage.start();
}

// TODO move this to a helper function
function convertDate(date: string) {
  const dateArray = date.split("-");
  const day = dateArray[0];
  const month = dateArray[1];
  const year = dateArray[2];
  return `${year}-${month}-${day}`;
}
