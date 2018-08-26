const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  //!clear 15
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("**Sorry, but you must have manage message premission for this command.❌**");
  if(!args[0]) return message.channel.send("-_-?");
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Cleared ${args[0]} messages.:wastebasket: `);
  });
}

module.exports.help = {
  name: "clear"
}
