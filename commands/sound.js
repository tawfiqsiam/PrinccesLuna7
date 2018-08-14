var date = new Date();
var nowtime = date.toLocaleTimeString();
const botconfig = require("../botconfig.json");
const prefix = botconfig.prefix;
const randomFile = require('select-random-file') // Random file
module.exports.run = async (bot, message) => {
    const Luna = [

        "luna",
      
      ];

      if (!message.guild) return;
      if (message.author.bot) return;
      if (message.channel.type === "dm") return;
      if (message.content.indexOf(prefix) !== 0) return;
    
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      let pony = args[0];
      console.log(pony);
      console.log(Luna[pony]);
      console.log(Luna.includes(pony));
      const soundsfolder = './sounds';

        
      if (Luna.includes(pony) !== false) {
        { if (message.member.voiceChannel) {
            message.member.voiceChannel.join() // Joins voice channel
              .then(connection => {
                message.delete() // Delets user command written before executing sound
                randomFile(`sounds/${pony}`, (err, file) => { // Gets random file from dir
                  const dispatcher = connection.playFile(`sounds/${pony}/${file}`) // Plays s specific sound
                  console.log(nowtime + ' ' + message.member + ` played sound of ${pony}: ${file}`); // Executes console log
                  dispatcher.on('end', () => { // Exits voice channel
                    connection.disconnect();
                  });
                })
              })
              .catch(console.log);
          } else {
            await message.channel.send(`${message.author.toString()}, You need to join a voice channel first!`);
          }
        }
      } else {
        await message.channel.send(`${message.author.toString()}, Are you sure that you have entered right value?`);
      }
    
    };
    module.exports.help = {
        name: "luna"
      }