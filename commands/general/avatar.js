const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const Discord = require('discord.js');
const {
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Avatarınızı gösterir.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Avatarınızı göstermek istediğiniz kullanıcının adını yazınız.')
            .setRequired(false)),
    async execute(interaction) {


        const veri = interaction.options.getUser("user") || interaction.user


        let Embed = new EmbedBuilder()
            .setColor('#ff0000') // <-- This is the hexadecimal color code for red.
            .setTitle(`${veri.username} Adlı Kişinin Avatarı`)
            .setImage(veri.avatarURL({
                dynamic: true,
                size: 256
            }))
            .setFooter({
                text: `NauNau ♡ Discord.js`
            })
        await interaction.reply({
            embeds: [Embed]
        });





    }
};