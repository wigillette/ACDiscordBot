const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const commandFolder = './commands';
const commandFiles = fs.readdirSync('discord/commands').map((file) => require(`${commandFolder}/${file}`));
const builtCommands =  commandFiles.map((commandModule) => new SlashCommandBuilder().setName(commandModule.command).setDescription(commandModule.desc));

module.exports = builtCommands.map(command => command.toJSON());