const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stock')
		.setDescription('Set stocked to true or false')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('shops id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('state')
                .setDescription('true/false')
                .setRequired(true)
                .addChoices({
                    name: 'true', 
                    value: 'true'
                },{
                    name: "false",
                    value: "false"
                })),
	async execute(interaction) {
		var id = interaction.options.getInteger("id")
            var state = interaction.options.getString("state")
        if(interaction.member.roles.cache.has(staffid)){
      
            
            
            db.run("UPDATE listing SET stock=? WHERE ID=?",[state.toString(),id])
            interaction.reply("Set listing ID[" + id.toString() + "] to stocked " + state);
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Set listing ID " + id.toString() + " to stocked state " + state);
            }
            if(interaction.member.roles.cache.has(keeperid)){
              if(state !== "true" && state !== "false"){
                interaction.reply("State isnt true nor false")
                return;
              }
              sql = "SELECT * FROM listing WHERE ID=?";
              db.each(sql,[id], (err, row) => {
                if(interaction.user.id.toString() == row["author"]){
                  db.run("UPDATE listing SET stock=? WHERE ID=?",[state.toString(),id])
                  interaction.reply("Set your listing ID[" + id.toString() + "] to stocked " + state);
                  interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Set listing ID " + id.toString() + " to stocked state " + state);
                }else{
                  interaction.reply("You can't change other people's stocks");
                }
              })
            }
	},
};
