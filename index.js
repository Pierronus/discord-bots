const Discord = require("discord.js");
const dotenv = require("dotenv");
const cron = require('cron');
const {Intents} = require("discord.js");

const { staffid, logid, keeperid, token } = require('./config.json');
dotenv.config();

const fs = require('node:fs');
const path = require('node:path');

const { Client, GatewayIntentBits, Partials , Constants, Collection} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}



client.on('ready', () => {
    console.log("bot ready")
	let scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {

	var search = fs.readFileSync("search.txt", "utf-8");
    client.channels.cache.get(logid).send("TODAY, " + String(search) + " SEARCHES HAVE BEEN MADE");
				  fs.writeFile("search.txt", "0", function (err) {
					  if (err) return console.log(err);
					});

});
scheduledMessage.start()
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
client.login(token)
