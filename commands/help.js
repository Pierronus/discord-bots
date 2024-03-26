const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Help for EMC Shop Search'),
	async execute(interaction) {
        var embedhelp = new EmbedBuilder()
        .setTitle("Help for EMC Market Search")
        .addFields(
                {name:"Search ITEM on listing for sale (namespaced ID)",value:"`/search sell minecraft_item_name` \n *Ex: /search sell baked_potatoe*"},
                {name:"Search ITEM on listing for buying (namespaced ID)",value:"`/search buy minecraft_item_name` \n *Ex: /search buy sugar_cane*"},
                {name:"Search USER on sales listing",value:"`/search sell @User` \n Ex: */search sell @Pierronus*"},
                {name:"Search USER on for buying listing",value:"`/search buy @User` \n Ex: */search buy @Pierronus*"},
                {name:"Note for shopkeepers!",value:"To add your items, please refer to the #how-to-add-items channel"},
                {name:"Check who is who",value:"`/who @User/Username`"},
                {name:"See what you sell & your seller info",value:"`/me`"},
                {name:"for staff",value:"`/helpmod`"},

        )

        interaction.reply({embeds: [embedhelp]});
	},
};