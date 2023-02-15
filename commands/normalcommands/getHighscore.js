const { MessageEmbed } = require("discord.js");
const hiscores = require("osrs-json-hiscores");
const Player = require("../../model/osrs");
const compare = require("../../helpers/functions/compare");
const _ = require("lodash");
const osrsSkills = {
  attack: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Attack_cape_emote.gif/200px-Attack_cape_emote.gif?ca355",
    color: 0x9b2007,
    placeholder: "https://oldschool.runescape.wiki/images/Attack.png?b3362",
  },
  defence: {
    gif: "https://oldschool.runescape.wiki/images/Defence_cape_emote.gif?fc8fe",
    color: 0x6277be,
    placeholder: "https://oldschool.runescape.wiki/images/Defence.png?deeb7",
  },
  strength: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Strength_cape_emote.gif/190px-Strength_cape_emote.gif?62d1a",
    color: 0x04955a,
    placeholder: "https://oldschool.runescape.wiki/images/Strength.png?015c3",
  },
  hitpoints: {
    gif: "https://oldschool.runescape.wiki/images/Hitpoints_cape_emote.gif?8f71c",
    color: 0x837e7e,
    placeholder: "https://oldschool.runescape.wiki/images/Hitpoints.png?3c12a",
  },
  ranged: {
    gif: "https://oldschool.runescape.wiki/images/Ranging_cape_emote.gif?566b2",
    color: 0x6d9017,
    placeholder: "https://oldschool.runescape.wiki/images/Ranged.png?ac80a",
  },
  magic: {
    gif: "https://oldschool.runescape.wiki/images/Magic_cape_emote.gif?79885",
    color: 0x3250c1,
    placeholder: "https://oldschool.runescape.wiki/images/Magic.png?3c12a",
  },
  cooking: {
    gif: "https://oldschool.runescape.wiki/images/Cooking_cape_emote.gif?f45fd",
    color: 0x702386,
    placeholder: "https://oldschool.runescape.wiki/images/Cooking.png?093de",
  },
  prayer: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Prayer_cape_emote.gif/130px-Prayer_cape_emote.gif?4ba50",
    color: 0x9f9323,
    placeholder: "https://oldschool.runescape.wiki/images/Prayer.png?ac80a",
  },
  woodcutting: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Woodcutting_cape_emote.gif/160px-Woodcutting_cape_emote.gif?1b924",
    color: 0x348c25,
    placeholder:
      "https://oldschool.runescape.wiki/images/Woodcutting.png?0a8f7",
  },
  fletching: {
    gif: "https://oldschool.runescape.wiki/images/Fletching_cape_emote.gif?c6c6f",
    color: 0x038d7d,
    placeholder: "https://oldschool.runescape.wiki/images/Fletching.png?ef869",
  },
  fishing: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Fishing_cape_emote.gif/190px-Fishing_cape_emote.gif?41d0c",
    color: 0x6a84a4,
    placeholder: "https://oldschool.runescape.wiki/images/Fishing.png?ef869",
  },
  firemaking: {
    gif: "https://oldschool.runescape.wiki/images/Firemaking_cape_emote.gif?5c8a5",
    color: 0xbd7819,
    placeholder: "https://oldschool.runescape.wiki/images/Firemaking.png?ef869",
  },
  crafting: {
    gif: "https://oldschool.runescape.wiki/images/Crafting_cape_emote.gif?9d103",
    color: 0x976e4d,
    placeholder: "https://oldschool.runescape.wiki/images/Crafting.png?19e67",
  },
  smithing: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Smithing_cape_emote.gif/190px-Smithing_cape_emote.gif?cb6e1",
    color: 0x6c6e4d,
    placeholder: "https://oldschool.runescape.wiki/images/Smithing.png?46893",
  },
  mining: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Mining_cape_emote.gif/180px-Mining_cape_emote.gif?df949",
    color: 0x5d8fa7,
    placeholder: "https://oldschool.runescape.wiki/images/Mining.png?ac80a",
  },
  herblore: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Herblore_cape_emote.gif/190px-Herblore_cape_emote.gif?5e829",
    color: 0x078509,
    placeholder: "https://oldschool.runescape.wiki/images/Herblore.png?3c12a",
  },
  agility: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Agility_cape_emote.gif/190px-Agility_cape_emote.gif?3af39",
    color: 0x3a3c89,
    placeholder: "https://oldschool.runescape.wiki/images/Agility.png?9b197",
  },
  thieving: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Thieving_cape_emote.gif/190px-Thieving_cape_emote.gif?44d24",
    color: 0x6c3457,
    placeholder: "https://oldschool.runescape.wiki/images/Thieving.png?015c3",
  },
  slayer: {
    gif: "https://oldschool.runescape.wiki/images/Slayer_cape_emote.gif?82a25",
    color: 0x646464,
    placeholder: "https://oldschool.runescape.wiki/images/Slayer.png?c6586",
  },
  farming: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Farming_cape_emote.gif/190px-Farming_cape_emote.gif?16a65",
    color: 0x65983f,
    placeholder: "https://oldschool.runescape.wiki/images/Farming.png?19e67",
  },
  runecraft: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Runecraft_cape_emote.gif/190px-Runecraft_cape_emote.gif?ba5a9",
    color: 0xaa8d1a,
    placeholder: "https://oldschool.runescape.wiki/images/Runecraft.png?46893",
  },
  hunter: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Hunter_cape_emote.gif/190px-Hunter_cape_emote.gif?d736a",
    color: 0x5c5941,
    placeholder: "https://oldschool.runescape.wiki/images/Hunter.png?3c12a",
  },
  construction: {
    gif: "https://oldschool.runescape.wiki/images/thumb/Construction_cape_emote.gif/190px-Construction_cape_emote.gif?c2bae",
    color: 0x82745f,
    placeholder:
      "https://oldschool.runescape.wiki/images/Construction.png?b3362",
  },
};

module.exports = {
  name: "highscore",
  description:
    "fetches the highscores and compares the levels stored in the database with the highscore data. if there are level increases the player will be congratiolated and the new data will be saved.",
  execute(channel) {
    Player.find()
      .exec()
      .then((docs) => {
        Object.keys(docs).forEach(async function (item) {
          try {
            await hiscores.getStats(docs[item].osrsName).then(async (res) => {
              const changes = compare(docs[item].stats, res.main.skills);
              const username = docs[item].osrsName.replace(
                new RegExp("_", "g"),
                " "
              );

              if (!_.isEmpty(changes)) {
                for (let skill in changes) {
                  if (
                    changes[skill].hasOwnProperty("level") &&
                    skill !== "overall"
                  ) {
                    if (docs[item].stats[skill].level < changes[skill].level) {
                      const levelups =
                        changes[skill].level - docs[item].stats[skill].level;
                      await Player.findOne({
                        _id: docs[item].id,
                      })
                        .then(async (doc) => {
                          doc.stats[skill] = changes[skill];
                          doc.markModified("stats");
                          await doc.save();
                        })
                        .then(() => {
                          const Embed = new MessageEmbed()
                            .setColor(osrsSkills[skill].color)
                            .setTitle(
                              `**${_.startCase(username)} has reached ${
                                changes[skill].level
                              } ${skill}!**`
                            )
                            .setDescription(
                              levelups > 1
                                ? `<@${docs[item].discordId}> has gained a total of ${levelups} level ups!`
                                : `<@${docs[item].discordId}> has gained 1 level!`
                            )
                            .setImage(osrsSkills[skill].gif)
                            .setThumbnail(osrsSkills[skill].placeholder)
                            .setTimestamp();

                          channel.send({
                            embeds: [Embed],
                          });
                        })
                        .catch((err) => console.log(err));
                    }
                  }
                }
              } else {
                console.log("no changes");
              }
            });
          } catch (err) {
            console.log(err);
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
