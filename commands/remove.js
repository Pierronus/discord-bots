const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});


module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove a listing')
		.addStringOption(option => option.setName('id').setDescription('Your shops ID (mod: @User)').setRequired(true)),
	async execute(interaction) {
		var cse = interaction.options.getString("id");
        if(interaction.member.roles.cache.has(staffid)){

          if(cse.startsWith("<@")){
            id = cse.replace("<@!","");
            id = id.replace("<@","")
            id = id.replace(">","");
            sql = "DELETE FROM listing WHERE author=? COLLATE NOCASE";
            db.run(sql,[id]);
            interaction.reply("Deleted all listings from " + cse);
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Deleted all listings from seller " + cse);
          }
          else{
            sql = "DELETE FROM listing WHERE ID=?"
            db.each(sql, [cse], (err,row) => {
            })
            interaction.reply("Deleted row with id " + cse.toString());
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Deleted listing ID["+cse.toString()+"]");
          }}
          if(interaction.member.roles.cache.has(keeperid)){
            var iden = interaction.member.id.toString()
            if(isNaN(cse)){
              interaction.reply("ID should be a number")
              return;
            }

            sql = "SELECT * FROM listing WHERE ID=?";
            db.each(sql,[cse], (err,row) => {
              if(iden == row["author"]){
                db.run("DELETE FROM listing WHERE ID=?",[cse])
                interaction.reply("Your listing ID " + cse + " has been deleted.");
                interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Deleted listing ID" + cse + " from seller <@" + iden + ">");
              }else{
                interaction.reply("You can't delete other person's listings");
              }
            })

          }
	},
};


