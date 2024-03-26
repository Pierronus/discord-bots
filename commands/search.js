const { SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
let sql;
const fs = require("fs");
const { staffid, logid, keeperid } = require('../config.json');
const { ButtonBuilder, ButtonStyle,  EmbedBuilder, MessageComponentInteraction, createMessageComponentCollector, ActionRowBuilder} = require('discord.js');
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
		.setName('search')
		.setDescription('Searches the listing')
        .addSubcommand((subcommand) =>
                          subcommand
                            .setName('buy')
                            .setDescription('Displays all BUY orders')
                            .addStringOption((option) =>
                              option
                                .setName('scope')
                                .setDescription('@User or minecraft_item_name')
                                .setRequired(true),
                            ),
                        )
        .addSubcommand((subcommand) =>
                          subcommand
                            .setName('sell')
                            .setDescription('Displays all SELL orders')
                            .addStringOption((option) =>
                              option
                                .setName('scope')
                                .setDescription('@User or minecraft_item_name')
                                .setRequired(true),
                            ),
                        ),
	async execute(interaction) {
    var search = fs.readFileSync("search.txt", "utf-8");
    
search = parseInt(search) + parseInt(1);
              fs.writeFile("search.txt", String(search), function (err) {
                  if (err) return console.log(err);
                });
		if(interaction.options.getSubcommand() === "buy"){
            var scope = interaction.options.getString("scope");
            if(scope.startsWith("<@")){
                var author = scope.replace("<@!","");
                author = author.replace(">","");
                author = author.replace("<@","");

                async function cmd(){
                  const query = await new Promise((resolve,reject) => {
                      db.all("SELECT * FROM listing WHERE author=? AND stock=? AND buying=? COLLATE NOCASE", [author,"true","true"], (err, rows) => {
                          if (err) {
                            reject(err);
                          }
                          if(rows.length.toString() == "0"){
                             interaction.reply("This user isnt registered or doesnt have any listings");
                          }else{
                            const {member, channel} = interaction;
                            const guilds = rows;
                            
                            
                            /**
                             * @param {number} start
                             * @returns {EmbedBuilder}
                             */
                            
                            
                             const generateEmbed = start => {
                            
                              const current = guilds.slice(start, start + 5)
                            
                            
                              return new EmbedBuilder().setTitle(`BUYING - Showing results ${start}-${start + current.length} out of ${guilds.length} results for ` + interaction.member.user.tag)
                              .setThumbnail("https://i.imgur.com/gDRJiSZ.png").setAuthor({name: "EMC Shop Search"})
                              .addFields(current.map(guild => ({
                                name: "ID[" + guild.ID + "]  |   " + "/n spawn " + guild.nation,
                                value: "```" + guild.item + " - " +  guild.itemcount + " for " + guild.price +" gold``` " + " `"+ guild.other + "`"
                             
                              })))
                              .setFooter({text:"Results ordered by price/itemcount"})
                            }
                            
                            
                            
                            const canFitOnOnePage = guilds.length <= 5;
                            interaction.reply({
                                embeds: [generateEmbed(0)],
                                components: canFitOnOnePage
                                  ? []
                                  : [new ActionRowBuilder({components: [forwardButton]})]
                              }).then(embedMessage=>{
                                if (canFitOnOnePage) return;
                                const collector = embedMessage.createMessageComponentCollector({
                                
                                    filter: ({user}) => user.id === user.id
                                  
                                })
                                  let currentIndex = 0
                                  collector.on('collect', async interaction => {
                            
                                    
                                    interaction.customId === backId ? (currentIndex -= 5) : (currentIndex += 5)
                                    
                                    interaction.update({
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
  
  
  
                          rows.forEach((row) => {
                        });
                      }
                      });
                  })
              }
  
              cmd();
            }else{
              async function cmd(){
                const query = await new Promise((resolve,reject) => {
                    db.all("SELECT * FROM listing WHERE item LIKE '%"+scope+"%' COLLATE NOCASE AND stock=? AND buying=? ORDER BY rapport", ["true","true"], (err, rows) => {
                        if (err) {
                          reject(err);
                        } 

const {member, channel} = interaction;
const guilds = rows;


/**
 * @param {number} start
 * @returns {EmbedBuilder}
 */


 const generateEmbed = start => {

  const current = guilds.slice(start, start + 5)


  return new EmbedBuilder().setTitle(`BUYING - Showing results ${start}-${start + current.length} out of ${rows.length} results for item ${scope}`)
  .setThumbnail("https://i.imgur.com/gDRJiSZ.png").setAuthor({name: "EMC Shop Search"})
  .addFields(current.map(guild => ({
    name: "ID[" + guild.ID + "]  |   " + "/n spawn " + guild.nation,
                                  value: "```" + guild.item + " - " +  guild.itemcount + " for " + guild.price +" gold``` " + " `"+ guild.other + "` \n<@"+guild.author+">"
                                 
  })))
  .setFooter({text:"Results ordered by price/itemcount"})
}



const canFitOnOnePage = guilds.length <= 5;
interaction.reply({
    embeds: [generateEmbed(0)],
    components: canFitOnOnePage
      ? []
      : [new ActionRowBuilder({components: [forwardButton]})]
  }).then(embedMessage=>{
    if (canFitOnOnePage) return;
    const collector = embedMessage.createMessageComponentCollector({
    
        filter: ({user}) => user.id === user.id
      
    })
      let currentIndex = 0
      collector.on('collect', async interaction => {

        
        interaction.customId === backId ? (currentIndex -= 5) : (currentIndex += 5)
        
        interaction.update({
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

                        rows.forEach((row) => {
                      });
                    });
                })
            }

            cmd();
            }
        }


        if(interaction.options.getSubcommand() === "sell"){
            var scope = interaction.options.getString("scope");
            if(scope.startsWith("<@")){
                var author = scope.replace("<@!","")
                author = author.replace(">","")
                author = author.replace("<@","")

                async function cmd(){
                  const query = await new Promise((resolve,reject) => {
                      db.all("SELECT * FROM listing WHERE author=? AND stock=? AND buying=? COLLATE NOCASE", [author,"true","false"], (err, rows) => {
                          if (err) {
                            reject(err);
                          }
                          if(rows.length.toString() == "0"){
                             interaction.reply("This user isnt registered or doesnt have any listings");
                             return;
                          }else{
  
                            const {member, channel} = interaction;
                            const guilds = rows;
                            
                            
                            /**
                             * @param {number} start
                             * @returns {EmbedBuilder}
                             */
                            
                            
                             const generateEmbed = start => {
                            
                              const current = guilds.slice(start, start + 5)
                            
                            
                              return new EmbedBuilder().setTitle(`SELLING - Showing results ${start}-${start + current.length} out of ${guilds.length} results for ` + interaction.member.user.tag) 
                              .setThumbnail("https://i.imgur.com/gDRJiSZ.png").setAuthor({name: "EMC Shop Search"})
                              .addFields(current.map(guild => ({
                                name: "ID[" + guild.ID + "]  |   " + "/n spawn " + guild.nation,
                          value: "```" + guild.item + " - " +  guild.itemcount + " for " + guild.price +" gold``` " + " `"+ guild.other + "`"
                        
                              })))
                              .setFooter({text:"Results ordered by price/itemcount"})
                            }
                            
                            
                            
                            const canFitOnOnePage = guilds.length <= 5;
                            interaction.reply({
                                embeds: [generateEmbed(0)],
                                components: canFitOnOnePage
                                  ? []
                                  : [new ActionRowBuilder({components: [forwardButton]})]
                              }).then(embedMessage=>{
                                if (canFitOnOnePage) return;
                                const collector = embedMessage.createMessageComponentCollector({
                                
                                    filter: ({user}) => user.id === user.id
                                  
                                })
                                  let currentIndex = 0
                                  collector.on('collect', async interaction => {
                            
                                    
                                    interaction.customId === backId ? (currentIndex -= 5) : (currentIndex += 5)
                                    
                                    interaction.update({
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
  
  
  
                          rows.forEach((row) => {
                        });
                      }
                      });
                  })
              }
  
              cmd();

            }else{
              async function cmd(){
                const query = await new Promise((resolve,reject) => {
                    db.all("SELECT * FROM listing WHERE item LIKE '%"+scope+"%' COLLATE NOCASE AND stock=? AND buying=? ORDER BY rapport", ["true","false"], (err, rows) => {
                        if (err) {
                          reject(err);
                        }const {member, channel} = interaction;
                        const guilds = rows;
                        
                        
                        /**
                         * @param {number} start
                         * @returns {EmbedBuilder}
                         */
                        
                        
                         const generateEmbed = start => {
                        
                          const current = guilds.slice(start, start + 5)
                        
                        
                          return new EmbedBuilder().setTitle(`SELLING - Showing results ${start}-${start + current.length} out of ${rows.length} results for item ${scope}`)
                          .setThumbnail("https://i.imgur.com/gDRJiSZ.png").setAuthor({name: "EMC Shop Search"})
                          .addFields(current.map(guild => ({
                            name: "ID[" + guild.ID + "]  |   " + "/n spawn " + guild.nation,
                            value: "```" + guild.item + " - " +  guild.itemcount + " for " + guild.price +" gold``` " + " `"+ guild.other + "` \n<@"+guild.author+">"
                           
                          })))
                          .setFooter({text:"Results ordered by price/itemcount"})
                        }
                        
                        
                        
                        const canFitOnOnePage = guilds.length <= 5;
                        interaction.reply({
                            embeds: [generateEmbed(0)],
                            components: canFitOnOnePage
                              ? []
                              : [new ActionRowBuilder({components: [forwardButton]})]
                          }).then(embedMessage=>{
                            if (canFitOnOnePage) return;
                            const collector = embedMessage.createMessageComponentCollector({
                            
                                filter: ({user}) => user.id === user.id
                              
                            })
                              let currentIndex = 0
                              collector.on('collect', async interaction => {
                        
                                
                                interaction.customId === backId ? (currentIndex -= 5) : (currentIndex += 5)
                                
                                interaction.update({
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



                        rows.forEach((row) => {
                      });
                    });
                })
            }

            cmd();
            }
        }
	},
};