const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const fs = require("fs");

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dump')
		.setDescription('Dumps info'),
	async execute(interaction) {
    var search = fs.readFileSync("search.txt", "utf-8");
		if(interaction.member.roles.cache.has(staffid)){
      interaction.channel.send("[ IGNORE ] " + String(search))

            var sqlee = "SELECT * FROM listing";
        async function cmd(){
          const query = await new Promise((resolve,reject) => {
              db.all(sqlee, [], (err, rows) => {
                  if (err) {
                    reject(err);
                  }
                  var sqley = "SELECT * FROM users";
                  db.all(sqley, [], (err, rowse) => {
                    if (err) {
                      reject(err);
                    }
                    interaction.reply("There are " + rows.length.toString() + " listings and " + rowse.length.toString() + " users registered.")
                  })
    
                  
                  
                })
              })
              }
              cmd();
        }else{
          interaction.reply("You aren't staff")
          return;
        }
	},
};
