const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Botun Pingini Gösterir.'),
	async execute(interaction) {
        const bot_ping = Math.abs(Date.now() - interaction.createdTimestamp)
        let Embed = new Discord.EmbedBuilder()
        .setColor('Random')
        .setTitle(`:ping_pong: | Bot Pingi: ${bot_ping}ms`)
		await interaction.reply({embeds: [Embed] });
	},
};