const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token, staffid, keeperid } = require('./config.json');
const permevery = {
	id: guild.roles.everyone.id,
	type: 'ROLE',
	permission: false,
  };
  const permkeep =  {
	id: botRole.id,
	type: 'ROLE',
	permission: true,
  };
  
  

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);