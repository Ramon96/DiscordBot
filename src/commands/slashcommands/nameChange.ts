import { SlashCommandBuilder } from "@discordjs/builders";
import { getStats } from "osrs-json-hiscores";
import osrsSchema from "../../model/osrs";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("namechange")
  .addStringOption((option) =>
    option
      .setName("old_rsn")
      .setDescription(
        "Previous Runescape name. Use '_' for spaces in your username"
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("new_rsn")
      .setDescription("New Runescape name. Use '_' for spaces in your username")
      .setRequired(true)
  )
  .setDescription("Name change your rsn in the database.");
export const name = "namechange";
export function execute(interaction: CommandInteraction) {
  const rsnold = interaction.options.getString("old_rsn");
  const rsnnew = interaction.options.getString("new_rsn");

  if (rsnold === null) {
    interaction.reply("Please provide a valid OSRS previous username.");
    return;
  }

  if (rsnnew === null) {
    interaction.reply("Please provide a valid OSRS new username.");
    return;
  }

  getStats(rsnnew)
    .then((res) => {
      new Promise((resolve, reject) => {
        osrsSchema.findOne({ osrsName: rsnold }, (err: any, doc: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      })
        .then((doc: any) => {
          doc.osrsName = rsnnew;
          doc.markModified("osrsName");
          doc.save();
          interaction.reply(`Changed username to ${rsnnew}`);
        })
        .catch((err: any) => {
          interaction.reply(`${rsnold} was not found in the collection.`);
        });
    })
    .catch((err: any) => {
      interaction.reply(`${rsnnew} was not found in the hiscores.`);
    });
}
