const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});

module.exports = {
        data: new SlashCommandBuilder()
                        .setName('edit')
                        .setDescription(
                          'Edit a listing',
                        )
                        .addSubcommand((subcommand) =>
                          subcommand
                            .setName('price')
                            .setDescription('Price')
                            .addIntegerOption((option) =>
                              option.setName('price')
                                .setDescription('Price')
                                .setRequired(true),
                            )
                            .addIntegerOption((option) =>
                              option.setName('id')
                                .setDescription('the shops ID')
                                .setRequired(true),
                            ),
                        )
                        .addSubcommand((subcommand) =>
                          subcommand
                            .setName('itemcount')
                            .setDescription('Displays information regarding the specified guild member')
                            .addIntegerOption((option) =>
                              option
                                .setName('count')
                                .setDescription('Itemcount')
                                .setRequired(true),
                            )
                            .addIntegerOption((option) =>
                              option.setName('id')
                                .setDescription('the shops ID')
                                .setRequired(true),
                            ),
                        )
                        .addSubcommand((subcommand) =>
                          subcommand
                            .setName('nation')
                            .setDescription('nation')
                            .addStringOption((option) =>
                              option
                                .setName('name')
                                .setDescription('Nation name')
                                .setRequired(true),
                            )
                            .addIntegerOption((option) =>
                              option.setName('id')
                                .setDescription('the shops ID')
                                .setRequired(true),
                            ),
                        ),
        
	async execute(interaction) {
    var iden = interaction.member.id.toString()
var id = interaction.options.getInteger("id")
              if(interaction.member.roles.cache.has(keeperid)){
                sql = "SELECT * FROM listing WHERE ID=?";
                if (interaction.options.getSubcommand() === 'itemcount') {
                    var data = interaction.options.getInteger("count");
        db.each(sql,[id], (err, row) => {
          if(iden == row["author"]){
            db.run("UPDATE listing SET itemcount=? WHERE ID=?",[data.toString(),id.toString()])
            interaction.reply("Edited listing ID " + id.toString() + " set itemcount to " + data.toString());
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Edited listing ID " + id.toString() + " set itemcount to " + data.toString());
          }else{
            interaction.reply("You can't change other people's listing");
          }
        })
      }
      if (interaction.options.getSubcommand() === 'price') {
        var data = interaction.options.getInteger("price");
          db.each(sql,[id], (err, row) => {
            if(iden == row["author"]){
              db.run("UPDATE listing SET price=? WHERE ID=?",[data.toString(),id.toString()])
              interaction.reply("Edited listing ID " + id.toString() + " set price to " + data.toString());
              interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id+ ">]" + "  |  Edited listing ID " + id.toString() + " set price to " + data.toString());
            }else{
              interaction.reply("You can't change other people's listing");
            }
          })
        
      }
      if (interaction.options.getSubcommand() === 'nation') {
        var data = interaction.options.getString("name");
        db.each(sql,[id], (err, row) => {
          if(iden == row["author"]){
            db.run("UPDATE listing SET nation=? WHERE ID=?",[data.toString(),id.toString()])
            interaction.reply("Edited listing ID " + id.toString() + " set nation nameto " + data.toString());
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id+ ">]" + "  |  Edited listing ID " + id.toString() + " set nation name to " + data.toString());
          }else{
            interaction.reply("You can't change other people's listing");
          }
        })
      }

              }
              if(interaction.member.roles.cache.has(staffid)){
                if (interaction.options.getSubcommand() === 'itemcount') {
                    var data = interaction.options.getInteger("count");
                  db.run("UPDATE listing SET itemcount=? WHERE ID=?",[data.toString(),id.toString()])
            interaction.reply("Edited listing ID " + id.toString() + " set itemcount to " + data.toString());
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Edited listing ID " + id.toString() + " set itemcount to " + data.toString());
          
                }
                if (interaction.options.getSubcommand() === 'price') {
                    var data = interaction.options.getInteger("price");
                  db.run("UPDATE listing SET price=? WHERE ID=?",[data.toString(),id.toString()])
            interaction.reply("Edited listing ID " + id.toString() + " set price to " + data.toString());
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Edited listing ID " + id.toString() + " set price to " + data.toString());
          
                }
                if (interaction.options.getSubcommand() === 'nation') {
                    var data = interaction.options.getString("name");
                  db.run("UPDATE listing SET nation=? WHERE ID=?",[data.toString(),id.toString()])
            interaction.reply("Edited listing ID " + id.toString() + " set nation name to " + data.toString());
            interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Edited listing ID " + id.toString() + " set nation name to " + data.toString());
          
                }
              }
	},
};
