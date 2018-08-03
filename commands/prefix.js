const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args, msg ) => {

  if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply("No no no.");
  if(!args[0] || args[0 == "help"]) return message.reply("Usage: !prefix <desired prefix here>");

  

  
  let sEmbed = new Discord.RichEmbed()
  .setColor("#FF9900")
  .setTitle("Prefix Set!")
  .setDescription(`Set to ${args[0]}`);

  message.channel.send(sEmbed);

}

module.exports.help = {
  name: "prefix"
}
