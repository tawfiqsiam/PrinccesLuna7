const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

 let helpembed = new Discord.RichEmbed()
 .setDescription("__**Princess Luna Help File**__")
 .setThumbnail()
 .setColor("#8300ff")
 .addField( "__**Member Commands:**__", "``help`` |`` serverinfo`` | ``botinfo`` | ``report`` | ``say`` | ``addrole`` | ``removerole`` ")
 .addField( "__**RPG Commmands:**__", "``coins`` | ``level`` | ``pay`` | ``fish`` | ``chop`` | ``mine`` | ``hunt`` | ``buy`` | ``shop`` | ``items`` | ``quest`` | ``class`` | ``fight`` | ``strength`` | ``wins`` | ``sell`` | ``rpglevel`` | ``quest`` | ``inv`` | ``strength`` | ``fight`` | ``wins`` | ``profile``")
 .addField("__**Modertion Commands:**__", "``warn`` | ``warnlevel`` | ``ban`` | ``kick`` | ``clear`` | ``prefix`` | ``tempmute``")
 .addField("__**Music Commands:**__", "``play`` | ``add`` | ``pause`` | ``resume`` | ``skip`` | ``join`` | ``volume -/+`` | ``queue``" );
   

try{
    await message.author.send(helpembed);
    message.react("✅");
    message.reply("**📥Check your DM.**")
}catch(e){
message.reply("Your DMs are locked.❌")
}
}

  module.exports.help = {
    name: "help"
  }