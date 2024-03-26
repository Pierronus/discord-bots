
const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { ButtonBuilder} = require('discord.js');
const { staffid, logid, keeperid } = require('../config.json');

const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});
const backId = 'back'
const forwardId = 'forward'
const backButton = new ButtonBuilder({
  style: 'SECONDARY',
  label: 'Back',
  emoji: '⬅',
  customId: backId
})
const forwardButton = new ButtonBuilder({
  style: 'SECONDARY',
  label: 'Forward',
  emoji: '➡',
  customId: forwardId
})
module.exports = {
	data: new SlashCommandBuilder()
    .setName('maddbuy')
    .setDescription('[mod] Add a BUYING order to the listing')
    .addIntegerOption(option =>
        option.setName('itemcount')
            .setDescription('How many')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('itemname')
            .setDescription('What item')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('price')
            .setDescription('At what price')
            .setRequired(true))
        .addStringOption(option =>
            option.setName("author")
            .setDescription("@author")
            .setRequired(true))
        .addStringOption(option =>
        option.setName('nationname')
            .setDescription('The nation name')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('additionalinfos')
            .setDescription('Can be enchantements, effects, location...')
            .setRequired(false)),
	async execute(interaction) {
		if(interaction.member.roles.cache.has(staffid)){
            const itemcount = interaction.options.getInteger("itemcount")
        const item = interaction.options.getString("itemname")
        const price = interaction.options.getInteger("price")
        var author = interaction.options.getString("author")
        const nation = interaction.options.getString("nationname")
        var other;
        other = interaction.options.getString("additionalinfos");
        
        author = author.replace("<@!","");
        author = author.replace("<@","")
        author = author.replace(">","");
        
            if(other === null){
              other = "none";
            }
              
              if(other.length > 115){
                interaction.reply("Additional infos has to be 115 or less characters");
                return;
              }
              
              var rapport;
            if(parseInt(price, 10) >= parseInt(itemcount, 10)){
            rapport = parseInt(price, 10) / parseInt(itemcount, 10);
            }
            if(parseInt(price, 10) <= parseInt(itemcount, 10)){
              rapport = parseInt(price, 10) / parseInt(itemcount, 10);
            }
        
              const rapp = rapport.toFixed(2);
            
        
              var sqle = `INSERT INTO listing(itemcount,item,price,author,nation,rapport,stock,other,buying) VALUES (?,?,?,?,?,?,?,?,?)`;
              let iden;
        sql = "SELECT * FROM users WHERE discordid=?";
              async function cmd(){
                const query = await new Promise((resolve,reject) => {
                  db.all(sql, [author], (err, rows) => {
                    if (err) {
                      reject(err);
                    }
                    if(rows.length.toString() == "0"){
                      interaction.reply("<@" + author + "> isnt verified yet");
                    }
                    rows.forEach((row) => {
                      interaction.reply("Added **buying** " + itemcount + " " + item + " for " + price + "g by buyer <@" + author + "> at /n spawn " + nation);
              interaction.guild.channels.cache.get(logid).send("[<@" + interaction.member.id + ">]" + "  |  Added **buying** " + itemcount + " " + item + " for " + price + "g by buyer <@" + author + "> at /n spawn " + nation);
              db.run(sqle,[itemcount,item,price,author,nation,rapp,"true",other,"true"]);
                    });
                  
                  });
                })
              }
        
        
              cmd();
        
            }
	},
};



