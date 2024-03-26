const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require("discord.js")
const { staffid, logid, keeperid } = require('../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('helpmod')
		.setDescription('Help for moderators'),
	async execute(interaction) {
                if(interaction.member.roles.cache.has(staffid)){
        var embedhelp = new Discord.EmbedBuilder()//     .addField({name:"See someone's balance [mod]",value: "`/credits balance @User/Username`"})
      //  .addField({name:"Add credits to user [mod]",value:"`/credits add @User/Username number`"})
    //    .addField({name:"Remove credits from user [mod]",value:"`/credits remove @User/Username number`"})
     //   .addField({name:"Reset balance to 0 [mod]",value:"`/credits reset @User/Username`"})

        .addFields(
                {name: "Add SELLING item on listing [mod]", value: "`/addsell itemcount itemname price @Seller nationname additional` \n *Ex: /maddsell 32 wheat 2 @Pierronus Indochina Cheap wheat here!* \n *Ex : For enchanted items /addsell . . . . Indochina Eff4*, Unb3\n**Max 115 characters**"},
                {name:"Add BUYING item on listing [mod]",value:"`/maddbuy itemcount itemname price @Seller nationanme additional`"},
                {name:"Remove item / seller on listing [mod]",value: "`/remove listing_id` or `/remove @Username` \n *Ex: /remove 21* or */remove @Pierronus*"},
                {name:"Bind @User to another @User [mod]",value:"`/bind @UserFrom @UserTo`"},
                {name:"Bind User to another User [mod]",value:"`/bind UserFrom UserTo`"},
                {name:"Verify user [mod]",value:"`/verify @User Username`"},
                {name:"Remove user [mod]",value:"`/deleteuser Username`"},
                {name:"Set stocked state",value:"`/stock ID true/false`"},
                {name:"Get info on bot",value:"`/dump`"},


        )

        interaction.reply({embeds: [embedhelp]});
	}else{
                interaction.reply("You aren't staff")
              return;
              }
}

};