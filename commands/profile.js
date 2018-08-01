const Discord = require("discord.js");
let coins = require("../coins.json");
let xp = require("../xp.json");

module.exports.run = async (bot, message, args) => {
  let uicon = message.author.displayAvatarURL;
  let uCoins = coins[message.author.id].coins;
  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let proEmbed = new Discord.RichEmbed()

  .setAuthor(message.author.username)
  .setColor("#8300ff")
  .setThumbnail(uicon)
  .addField('**Level:**', + curlvl, true)
  .addField("**EXP:**", curxp, true)
  .addField("**Balance:**", uCoins )
  
  message.channel.send(proEmbed);
}

module.exports.help = {
  name:"profile"
}