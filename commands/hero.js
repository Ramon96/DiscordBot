// const fetchHero = require('../../helpers/api/superhero/fetchHero');
// const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// module.exports = {
//     name: "hero",
//     description: "returns data of a superhero",
//     execute(message) {
//         const hero = message.content.split(' ').slice(1).join(' ');
//         if (!hero) {
//             message.channel.send('Please provide a hero name');
//             return;
//         }
//         fetchHero(hero)
//             .then(data => {

//                 console.log(data.results.length);

//                 if (data.results.length > 1) {
//                     const row = new MessageActionRow();
//                     data.results.forEach(hero => {
//                         row.addAction(new MessageButton(hero.name, hero.id));
//                     });
                    
//                     const embed = new MessageEmbed()
//                         .setTitle('Multiple results found')
//                         .setDescription(`Please select a hero`)
//                         .setColor('#0099ff')
//                         .setFooter('Powered by Marvel API')
//                         .setTimestamp()
//                         .setThumbnail('https://i.imgur.com/wSTFkRM.png')
//                         .setAuthor('Superheroes', 'https://i.imgur.com/wSTFkRM.png')
//                         .setDescription(row.toString());
//                     message.channel.send(embed);
//                     return;
                    
//                 }

//                 // const embed = new MessageEmbed()
//                 //     .setTitle(data.name)
//                 //     .setURL(data.url)
//                 //     .setDescription(data.description)
//                 //     .setColor(0x00AE86)
//                 //     .setThumbnail(data.image.url)
//                 //     .addFields(
//                 //         { name: 'Alter ego', value: data.biography.alterEgo, inline: true },
//                 //         { name: 'Full name', value: data.biography.fullName, inline: true },
//                 //         { name: 'Publisher', value: data.biography.publisher, inline: true },
//                 //         { name: 'Alignment', value: data.biography.alignment, inline: true },
//                 //         { name: 'Place of birth', value: data.biography.placeOfBirth, inline: true },
//                 //         { name: 'First appearance', value: data.biography.firstAppearance, inline: true },
//                 //         { name: 'Alignment', value: data.biography.alignment, inline: true },
//                 //     )
//                 //     .setTimestamp()
//                 //     .setFooter('Powered by Marvel API', 'https://i.imgur.com/wSTFkRM.png');

//                 // message.channel.send(embed);
//             })
//             .catch(err => {
//                 console.log(err);
//                 message.channel.send('Hero not found');
//             });
//     }
// }