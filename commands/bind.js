const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bind')
		.setDescription('Bind @User to @AnotherUser or Username to AnotherUsername')
        .addStringOption(option =>
            option.setName('userfrom')
                .setDescription('@UserFrom or UsernameFrom')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('userto')
                .setDescription('@UserTo or UsernameTo')
                .setRequired(true)),
	async execute(interaction) {
		if(interaction.member.roles.cache.has(staffid)){
  
            var from = interaction.options.getString("userfrom")
            var to = interaction.options.getString("userto")
        
            if(from.toLowerCase().startsWith("<@")){
              if(!to.toLowerCase().startsWith("<@")){
                interaction.reply("Destination isnt @User");
                return;
              }
              var fromid = from.replace("<@!","");
              fromid = fromid.replace("<@","")
              fromid = fromid.replace(">","");
              var toid = to.replace("<@!","");
              toid = toid.replace("<@","")
              toid = toid.replace(">","");
              sql = "SELECT * FROM users WHERE discordid=?";
              db.all(sql, [fromid], (err, rows) => {
                if (err) {
                  reject(err);
                }
                if(rows.length.toString() == "0"){
                  interaction.reply("<@"+fromid+">" + " doesnt exist in the database");
                }
                rows.forEach((row) => {
                  var stat = "UPDATE users SET discordid=? WHERE discordid=?";
                  var stat2 = "UPDATE listing SET author=? WHERE author=?";
                  db.run(stat2,[toid,fromid]);
                  db.run(stat,[toid,fromid]);
                  interaction.reply("Changed <@" + fromid + "> to <@" + toid + "> which username is " + row["username"]);
                  interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Changed <@" + fromid + "> to <@" + toid + "> in database which username is " + row["username"]);
        
                });
              
              });
            }else{
              if(to.toLowerCase().startsWith("<@")){
                interaction.reply("Destination isnt Username");
                return;
              }
              sql = "SELECT * FROM users WHERE username=? COLLATE NOCASE";
              db.all(sql, [from], (err, rows) => {
                if (err) {
                  reject(err);
                }
                if(rows.length.toString() == "0"){
                  interaction.reply(from + " doesnt exist in the database");
                }
                rows.forEach((row) => {
                  var stat = "UPDATE users SET username=? WHERE username=?";
                  db.run(stat,[to,from]);
                  interaction.reply("Changed " + from + " to " + to + " which discord is <@" + row["discordid"] + ">");
                  interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Changed " + from + " to " + to + " in database which discord is <@" + row["discordid"] + ">");
        
                });
              
              });
            }
          }
          else{
            interaction.reply("You aren't staff")
          return;
          }
	},
};


