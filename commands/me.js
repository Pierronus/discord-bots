const { SlashCommandBuilder, MembershipScreeningFieldType , ComponentType} = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const { staffid, logid, keeperid } = require('../config.json');

const { ButtonBuilder, ButtonStyle,  EmbedBuilder, MessageComponentInteraction, createMessageComponentCollector, ActionRowBuilder} = require('discord.js');
const Discord = require("discord.js")
const db = new sqlite3.Database('./data.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
});
const backId = 'back'
const forwardId = 'forward'
const backButton = new ButtonBuilder({
  style: ButtonStyle.Secondary,
  label: 'Back',
  emoji: '⬅',
  customId: backId
})
const forwardButton = new ButtonBuilder({
  style: ButtonStyle.Secondary,
  label: 'Forward',
  emoji: '➡',
  customId: forwardId
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('me')
		.setDescription('See your profile info'),
	async execute(interaction) {
        sql = "SELECT * FROM users WHERE discordid=?";
        db.all(sql, [interaction.member.id.toString()], (err, dds) => {
          if (err) {
            reject(err);
          }
          if(dds.length.toString() == "0"){
            interaction.reply("You aren't verified. Ask a moderator");
          }
          dds.forEach((dd) => {
            
           
            var sqle;
            sqle = `SELECT * FROM listing WHERE author=? COLLATE NOCASE ORDER BY ID DESC`;
            async function cmd(){
                const query = await new Promise((resolve,reject) => {
                    db.all(sqle, [dd["discordid"]], (err, rows) => {
                        if (err) {
                          reject(err);
                        }
                        var embd = new Discord.EmbedBuilder()
            .setTitle("Your seller info")
            .setDescription("Your Discord account is bound to " + dd["username"])
            .addFields({name:"Total listings:",value: rows.length.toString()});
            interaction.reply({embeds: [embd]})

const {member, channel} = interaction;
const guilds = rows;


/**
 * @param {number} start
 * @returns {EmbedBuilder}
 */


 const generateEmbed = start => {

  const current = guilds.slice(start, start + 5)

  return new EmbedBuilder().setTitle(`Showing results ${start}-${start + current.length} out of ${guilds.length} results for you`)
  .setThumbnail("https://i.imgur.com/gDRJiSZ.png").setAuthor({name: "EMC Shop Search"})
  .addFields(current.map(guild => ({
    name: "ID[" + guild.ID + "]  |  " + dd["username"] + " - " + "/n spawn " + guild.nation,
                        value: "```" + guild.item + " - " +  guild.itemcount + " for " + guild.price +" gold```"  + " `"+ guild.other + "`" + " \nStocked : " + guild.stock + "\nBUYING: " + guild.buying

  })))
}



const canFitOnOnePage = guilds.length <= 5;
interaction.channel.send({
    embeds: [generateEmbed(0)],
    components: canFitOnOnePage
      ? []
      : [new ActionRowBuilder({components: [forwardButton]})]
  }).then(embedMessage=>{
    if (canFitOnOnePage) return;
    console.log(embedMessage)
    const collector = embedMessage.createMessageComponentCollector({
    
        filter: ({user}) => user.id === user.id
      
    })
      let currentIndex = 0
      collector.on('collect', async interaction => {

        interaction.customId === backId ? (currentIndex -= 5) : (currentIndex += 5)
        await interaction.update({
          embeds: [generateEmbed(currentIndex)],
          components: [
            new ActionRowBuilder({
              components: [
                ...(currentIndex ? [backButton] : []),
                ...(currentIndex + 5 < guilds.length ? [forwardButton] : [])
              ]
            })
          ]
        })
      })
  });
                    });
                })
            }

            cmd();
          });
        
        });
	},
};
