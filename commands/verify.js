const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verifies user')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Discord @User')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username')
                .setRequired(true)),
	async execute(interaction) {
		if(interaction.member.roles.cache.has(staffid)){
            var discord = interaction.options.getString("user")
            var username = interaction.options.getString("username")
          
            let dbusername;
            let dbdiscord;
            sql = "SELECT * FROM users WHERE discordid=? COLLATE NOCASE"
            var id = discord.replace("<@!","");
            id = discord.replace("<@","");
            var id2 = id.replace(">","");
                db.all(sql, [id2], (err, rows) => {
                    if (err) {
                      reject(err);
                    }
                    if(rows.length.toString() == "0"){
                      interaction.reply("Binding " + discord + " to " + username);
                db.run("INSERT INTO users (discordid,username,credits) VALUES (?,?,?)",[id2,username,0]);
                interaction.channel.send("Bound " + discord + " to username " + username);
                interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Verified " + discord + " to " + username);
          
                    }else{
                      rows.forEach((row) => {
                        dbusername = row["username"];
                        dbdiscord = "<@" + row["discordid"] + ">";
                        interaction.reply(dbusername + " is already bound to " + dbdiscord);
            
            
                      });
                    }
                    
                  
                  });
                
          
              
          
          
            }
            else{
              interaction.reply("You aren't staff")
              return;
            }
	},
};
