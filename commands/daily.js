const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const moment = require('moment');
const fs = require("fs");
let coins = require("../coins.json");
exports.run = async (bot, message, args) => {
  let bicon = bot.user.displayAvatarURL;
  let embed = new Discord.RichEmbed()
  .setTitle("__Daily Reward__")
  .setDescription("**You have collected 100 coins!💰**")
  .setColor(botconfig.purple)
  .setThumbnail(bicon)
  let bicons = bot.user.displayAvatarURL;
  let no = new Discord.RichEmbed()
  .setTitle("__Daily Reward__")
 
  .setDescription("**You have already collected todays money!❌**")
  .setColor(botconfig.red)
  .setThumbnail(bicons)

  if(!coins[message.author.id].lastDaily) coins[message.author.id].lastDaily = 'Not collected daily money'

  if(coins[message.author.id].lastDaily != moment().format('L')) {
    coins[message.author.id].lastDaily = moment().format('L')
    coins[message.author.id].coins +=100;
    message.channel.send(embed)
    fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) console.log(err)
    });
  } else {
    message.channel.send(no)
  }

}
module.exports.help = {
    name: "daily"
  }