const Discord = require("discord.js");
const fs = require("fs");
const strength = require("../playerstats/strength.json");
const botconfig = require("../botconfig.json");
const questL = require("../questhandler/questcompleted.json");
const fishL = require("../playerstats/fishing.json");
const fishInv = require("../playerinventory/fish.json");
const wood = require("../playerinventory/wood.json");
const ore = require("../playerinventory/ore.json");
const meat = require("../playerinventory/meat.json");
const purple = botconfig.purple;

module.exports.run = async (bot, message, args) => {
  if(!fishInv[message.author.id]){
    fishInv[message.author.id] = {
      fish: 0
    };
  }

  if(!ore[message.author.id]){
    ore[message.author.id] = {
      ore: 0
    };
  }

  if(!wood[message.author.id]){
    wood[message.author.id] = {
      wood: 0
    };
  }

  if(!meat[message.author.id]){
    meat[message.author.id] = {
      meat: 0
    }
  }

  let fishamt = fishInv[message.author.id].fish;
  let oreamt = ore[message.author.id].ore;
  let woodamt = wood[message.author.id].wood;
  let meatamt = meat[message.author.id].meat;

  let invembed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setThumbnail(message.author.displayAvatarURL)
  .setColor(purple)
  .setTitle("Inventory")
  .addField("🐟Fish", fishamt, true)
  .addField("⛏Ore", oreamt, true)
  .addField("🌲Wood", woodamt, true)
  .addField("🍖Meat", meatamt, true);
  message.delete();
  message.channel.send(invembed);
}

module.exports.help = {
  name: "inv"
}
