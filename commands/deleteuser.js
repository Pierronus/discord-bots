const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deleteuser')
		.setDescription('Delete a User completely')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username')
                .setRequired(true)),
	async execute(interaction) {
		if(interaction.member.roles.cache.has(staffid)){
            
            var user = interaction.options.getString("username");
            if(user.startsWith("<@")){
              user = user.replace("<@!","")
              user = user.replace("<@","")
              user = user.replace(">","")
              sql = "SELECT * FROM users WHERE discordid=? COLLATE NOCASE"
            async function cmd(){
              const query = new Promise((resolve,reject) => {
            db.all(sql, [user], (err, rows) => {
              if (err) {
                reject(err);
              }
              if(!rows){
                interaction.reply("<@" + user + "> doesnt exist in the database");
              }
              rows.forEach((row) => {
                var stat = "DELETE FROM users WHERE discordid=? COLLATE NOCASE";
                var stat2 = "DELETE FROM listing WHERE author=?";
                db.run(stat2,[row["discordid"]]);
                db.run(stat,[user]);
                interaction.reply("<@" + user + "> was removed from db")
                interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Deleted <@" + user + "> from db");
    
              });
            
            });
          });
        }
        feelingCommand();
            }else{
              sql = "SELECT * FROM users WHERE username=? COLLATE NOCASE"
            async function feelingCommand(){
              const query = new Promise((resolve,reject) => {
            db.all(sql, [user], (err, rows) => {
              if (err) {
                reject(err);
              }
              if(rows.length.toString() == "0"){
                interaction.reply(user + " doesnt exist in the database");
              }
              rows.forEach((row) => {
                var stat = "DELETE FROM users WHERE username=? COLLATE NOCASE";
                var stat2 = "DELETE FROM listing WHERE author=?";
                db.run(stat2,[row["discordid"]]);
                db.run(stat,[user]);
                interaction.reply(user + " was removed from db")
                interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Deleted " + user + " from db");
    
              });
            
            });
          });
        }
        cmd();
            }
          }else{
            interaction.reply("You aren't staff")
          return;
          }
	},
};
