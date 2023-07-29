const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    Discord,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Varsa, bannerınızı gösterir.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Bannerını göstermek istediğiniz kullanıcının adını yazınız.')
            .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        // Fetch the user's data
        await user.fetch();

        if (!user.banner) {
            interaction.reply("This user doesn't have a banner!", {
                ephemeral: true
            });
        } else {
            const BannerEmbed = new EmbedBuilder()
                .setTitle(`${user.username}'s banner`)
                .setImage(user.bannerURL({
                    size: 1024
                }))
                .setTimestamp();

            interaction.reply({
                embeds: [BannerEmbed]
            });
        }
    }
};