const botconfig = require("./botconfig.json");
const TOKEN = process.env.tokenkey;
const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const fs = require("fs");
const YouTube = require("simple-youtube-api");
const bot = new Discord.Client();

bot.commands = new Discord.Collection();

let coins = require("./coins.json");
let xp = require("./xp.json");
let purple = botconfig.purple;
let cooldown = new Set();
let cdseconds = 2;
const prefix = botconfig.prefix;
const color = botconfig.color;


const yt_api_key = process.env.GOOGLE_API;

const youtube = new YouTube(yt_api_key);

//Sona sounds
const ultpath = "/Desktop - HDD/sona.mp3"

let queue = new Map();

let dispatcher;


bot.on("disconnect", async() => {
  console.log("BRB, going back to base!");
});

bot.on("reconnecting", async() =>{
  console.log("Coming back to lane!");
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  let args = message.content.split(" ").splice(1);
  let serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)){
    let voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send("**You must be in a voice channel to use this bot!**❌");
    let permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.channel.send("Inadequate permissions for me!");
    if (!permissions.has("SPEAK")) return message.channel.send("Inadequate permissions for me!");
    try {
      var video = await youtube.getVideo(args[0]);
    } catch(err){
      try {
        var searchname = args.join(" ");
        let videos = await youtube.searchVideos(searchname, 1);
        video = await youtube.getVideoByID(videos[0].id);
      } catch(error) {
        console.log(error);
        return message.channel.send("Could not find any videos!");
      }
    }

    const song = {
      id: video.id,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`
    };

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        dispatcher: null,
        songs: [],
        volume: 1,
        playing: true
      };
      queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);
      connection = await voiceChannel.join().catch(err => {
        message.channel.send(`Error: ${err}`);
        queue.delete(message.guild.id);
        return;
      });
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`**Added ${song.title} to the queue**✅`);
    }
  } else if (message.content.startsWith(`${prefix}pause`)) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voiceChannel) return message.channel.send("**You must be in a voice channel to use this bot!**❌");
    if (!serverQueue) return message.channel.send("**Nothing is playing right now!**❌");
    if (!serverQueue.dispatcher.paused){
      serverQueue.dispatcher.pause();
      return message.channel.send("**Paused playing!**:pause_button:");
    } else {
      return message.channel.send("**Nothing is playing right now!**❌");
    }
  } else if (message.content.startsWith(`${prefix}resume`)) {
    if (!message.member.voiceChannel) return message.channel.send("**You must be in a voice channel to use this bot!**❌");
    if (!serverQueue) return message.channel.send("**Nothing is playing right now!**❌");
    if (serverQueue.dispatcher.paused){
      serverQueue.dispatcher.resume();
      return message.channel.send("**Resumed playing!**:play_pause: ")
    } else {
      return message.channel.send("**Something is already playing!**🔊");
    }
  } else if (message.content.startsWith(`${prefix}volume`)) {
    if (!message.member.voiceChannel) return message.channel.send("**You must be in a voice channel to use this bot!**❌");
    if (!serverQueue) return message.channel.send("**Nothing is playing right now!**❌");
    if (!args[0]) return message.channel.send(`**The current volume is:** ${serverQueue.volume}`);
    serverQueue.dispatcher.setVolumeLogarithmic(args[0]);
    return message.channel.send(`**Set the volume to:** ${args[0]}🔊`);
  } else if (message.content.startsWith(`${prefix}skip`)) {
    if (!message.member.voiceChannel) return message.channel.send("**You must be in a voice channel to use this bot!**❌");
    if (!serverQueue) return message.channel.send("**Nothing is playing right now!**❌");
    serverQueue.dispatcher.end();
    return message.channel.send("**Skipped song!**")
  } else if (message.content.startsWith(`${prefix}stop`)) {
    if (!message.member.voiceChannel) return message.channel.send("**You must be in a voice channel to use this bot!**❌");
    if (!serverQueue) return message.channel.send("**Nothing is playing right now!**❌");
    serverQueue.songs = [];
    serverQueue.dispatcher.end();
    return message.channel.send("**Stopped and cleared queue!**:recycle:");
  } else if (message.content.startsWith(`${prefix}np`)) {
    if (!serverQueue) return message.channel.send("**Nothing is playing right now!**❌");
    return message.channel.send(`🎵 **Currently playing:** ${serverQueue.songs[0].title}`);
   } else if (message.content.startsWith(`${prefix}help`)) {
      let tosend = ['```xl', botconfig.prefix + 'join : "Join Voice channel of msg sender"', botconfig.prefix + 'np : "Shows the currently playing song"', botconfig.prefix + 'queue : "Shows the current queue, up to 15 songs shown."', botconfig.prefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), botconfig.prefix + 'pause : "pauses the music"',	botconfig.prefix + 'resume : "resumes the music"', botconfig.prefix + 'skip : "skips the playing song"', botconfig.prefix + 'stop : "Forces the bot to stop whatever it is playing and leave the voice channel."','volume 1-5 : "adjusts the sound"','```'];
      message.channel.sendMessage(tosend.join('\n'));
  } else if (message.content.startsWith(`${prefix}queue`)){
    if (!serverQueue) return message.channel.send("**Nothing is playing right now!**❌");
    let embedqueue = new Discord.RichEmbed()
    .setTitle("__**Song Queue**__")
    .setDescription("Songs currently in queue")
    .setColor(color);
    for (i = 0; i < serverQueue.songs.length; i++){
      embedqueue.addField(`${i + 1}.`,`${serverQueue.songs[i].title}`);
    }
    return message.channel.send(embedqueue);
  }
});

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {

  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity("4K TV", {type: "WATCHING"});

});

  
    
  
  
  


bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    }
  
  if(!message.content.startsWith(prefix)) return;
  if(cooldown.has(message.author.id)){
    message.delete();
    let cdembed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor(botconfig.red)
    .addField("❌Error", "You need to wait 5 secs between commands.");
    return message.channel.send(cdembed).then(msg => {msg.delete(3000)});1
  }
  if(!message.member.hasPermission("ADMINISTRATOR")){
    cooldown.add(message.author.id);
  }
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
	}
	
  if(!coins[message.author.id]){
    coins[message.author.id] = {
      coins: 0
    };
	}

  let coinAmt = Math.floor(Math.random() * 10) + 1;
  let baseAmt = Math.floor(Math.random() * 10) + 1;
  console.log(`${coinAmt} ; ${baseAmt}`);

  if(coinAmt === baseAmt){
    coins[message.author.id] = {
      coins: coins[message.author.id].coins + coinAmt
    };
  fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
    if (err) console.log(err)
  });
  let coinEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#0000FF")
  .addField("💰", `${coinAmt} coins added!`).then(msg => {msg.delete(3000)});
  

  message.channel.send(coinEmbed);
  }

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);
  
  if(!cooldown.has(message.author.id))

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 500;
  let bicon = bot.user.displayAvatarURL;
  xp[message.author.id].xp =  curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setTitle("Level Up!")
    .setColor(purple)
    .setThumbnail(bicon)
    .addField("New Level", curlvl + 1);

    let levelupchannel = message.guild.channels.find(`name`, "level-up-чат");
    if(!levelupchannel) return message.reply("Couldn't find channel");
    
    levelupchannel.send(lvlup);
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
  });

  let prefix = prefixes[message.guild.id].prefixes;
  if(!message.content.startsWith(prefix)) return;
  if(cooldown.has(message.author.id)){
    message.react("⌛");
    return message.reply("You have to wait 2 seconds between commands.").then(m => m.delete(5000));

    
  }
  //if(!message.member.hasPermission("ADMINISTRATOR")){
    cooldown.add(message.author.id);
//}


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000)

});

bot.login(TOKEN);

//ALL YOUTUBE/MUSIC FUNCTIONS HERE
function play(guild, song){
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  serverQueue.textChannel.send(`🎶Now playing ${song.title}`);
  serverQueue.dispatcher = serverQueue.connection.playStream(ytdl(song.url), {
    filter: "audioonly",
    quality: "highestaudio"
  })
  .on("end", async() => {
    if (serverQueue.songs.length > 0){
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0])
    } else {
      serverQueue.voiceChannel.leave();
    }
  })
  .on("error", (err) => serverQueue.textChannel.send(`Error: ${err}`));
  serverQueue.dispatcher.setVolumeLogarithmic(serverQueue.volume);
}