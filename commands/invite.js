const Discord = require("discord.js")
const db = require("quick.db")
const fs = require('fs')
const yaml = require("js-yaml");
const backup = require("discord-backup")
const { mainprefix , token, attention, permission, messagesfetchlimts, yes, arrowhere, botlog } = yaml.load(fs.readFileSync("./config.yml"));

module.exports = {
    name: "invite",
    description: "Load Your Guild Backup",
 
     run: async (client, message, args) => {
 let inviteebed = new Discord.MessageEmbed()
 .setAuthor(client.user.username, client.user.displayAvatarURL())
 .setDescription(`${arrowhere} [Click Here](https://discord.com/oauth2/authorize?client_id=747078286223343646&scope=bot&permissions=8)\n Support server[Click Here](https://discord.gg/K9hptw4) `)
.setFooter(message.author.username, message.athor.displayAvatarURL())   
message.channel.send(inviteebed)
}
  }