console.log("If This Take Too long make sure u have add right token!")
const fs = require('fs')
const yaml = require("js-yaml");
const { mainprefix , token, messagesfetchlimts, status, botlog } = yaml.load(fs.readFileSync("./config.yml"));
const Discord = require('discord.js')
const client = new Discord.Client();
const db = require('quick.db')
const { join } = require('path');
const { readdirSync } = require('fs');
client.commands= new Discord.Collection();
client.login(token)

  
client.on('ready', () => {
    client.channels.cache.get(botlog).send(`** Bot Is Running**\n Servers: ${client.guilds.cache.size} And ${client.users.cache.size} Users`)
    client.user.setActivity(status, { type: 'PLAYING' });
  console.clear();
  console.log('\n\x1b[32m%s\x1b[0m', `          $[INFO]: Logged on ${client.user.tag}`);  
  console.log('\x1b[32m%s\x1b[0m', `           $[INFO]: PREFIX ${mainprefix}`);  
  console.log('\x1b[32m%s\x1b[0m', `           $[EXTRA]: BACKUP`);  
 });

 const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

 for (const file of commandFiles) {
     const command = require(join(__dirname, "commands", `${file}`));
     client.commands.set(command.name , command);
 }
 
 client.on("message", async message => {
  
  let prefix;
  let pref = db.get(`prefix.${message.guild.id}`);
  if (!pref) {
    prefix = "b!"; // If the server doesn't have any custom prefix, return default.
  } else {
    prefix = pref;
  }
       if(message.author.bot) return;
       if(message.channel.type === 'dm') return;
   
       if(message.content.startsWith(prefix)) {
           const args = message.content.slice(prefix.length).trim().split(/ +/);
   
           const command = args.shift().toLowerCase();
   
           if(!client.commands.has(command)) return;
   
   
           try {
               client.commands.get(command).run(client, message, args);
               if (!command) command = client.commands.get(client.aliases.get(command));

           } catch (error){
               console.error(error);
           }
        }
   })
   client.on("guildCreate", guild => {
    client.channels.cache.get(botlog).send(`** NEW GUILD **\n Server: ${guild.name}\n Server ID: ${guild.id}`)
  });
  client.on("guildRemove", guild => {
    client.channels.cache.get(botlog).send(`** GUILD REMOVED **\n Server: ${guild.name}\n Server ID: ${guild.id}`)
  });
  client.on('message', async message => {
    if (message.author.bot) return; // Ignore if the user is a bot.
    
    let pref = db.get(`prefix.${message.guild.id}`);
    let prefix;
    
    if (!pref) {
      prefix = "b!"; // If the server doesn't have any custom prefix, return default.
    } else {
      prefix = pref;
    }
    
    if (!message.content.startsWith(prefix)) return; // use this. so your bot will be only executed with prefix.
    
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let msg = message.content.toLowerCase();
    let cmd = args.shift().toLowerCase();
    
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1)); // Message Flags: -default, -ban, -parameter
    }
    
    if (msg.startsWith(prefix + "prefix")) {
      if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("You don't have any permissions to do this!");
      let data = db.get(`prefix.${message.guild.id}`);
      if (message.flags[0] === "default") {
        await db.delete(`prefix.${message.guild.id}`);
        return message.channel.send("The server prefix has been changed into default.");
      }
      
      let symbol = args.join(" ");
      if (!symbol) return message.channel.send("Please input the prefix.");
      
      db.set(`prefix.${message.guild.id}`, symbol);
      return message.channel.send(`The server prefix has been changed to **${symbol}**`);
    }
  });  