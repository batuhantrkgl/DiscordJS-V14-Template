const {
	Events
} = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Hazırız Kaptan! ${client.user.tag} olarak giriş yapıldı.`);
		client.user.setPresence({
			activities: [{
				name: 'https://twitch.tv/nautaveters'
			}]
		});
	},
};