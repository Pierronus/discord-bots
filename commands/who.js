const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('who')
		.setDescription('Check who is who in minecraft')
        .addStringOption(option =>
            option.setName('who')
                .setDescription('Specify either @User or Username')
                .setRequired(true)),
    
	async execute(interaction) {
		var prs = interaction.options.getString("who")
 
        if(prs.startsWith("<@")){
            var discordid = prs.replace("<@!","")
            discordid = discordid.replace("<@","")
            discordid = discordid.replace(">","")
          sql = "SELECT * FROM users WHERE discordid=?";
            db.all(sql, [discordid], (err, rows) => {
              if (err) {
                reject(err);
              }
              if(rows.length.toString() == "0"){
                interaction.reply("<@"+discordid+">" + " doesnt exist in the database");
              }
              rows.forEach((row) => {
                interaction.reply(prs + " is " + row["username"]);
                
              });
            
            });
        }else{
          sql = "SELECT * FROM users WHERE username=? COLLATE NOCASE";
          db.all(sql, [prs], (err, rows) => {
            if (err) {
              reject(err);
            }
            if((rows.length).toString() == "0"){
              interaction.reply(prs + " doesnt exist in the database");
            }
            rows.forEach((row) => {
              interaction.reply(prs + " is <@" + row["discordid"] + ">");
              
            });
          
          });
        }
	},
};
