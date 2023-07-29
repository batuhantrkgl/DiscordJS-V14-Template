const {
    SlashCommandBuilder
} = require('@discordjs/builders')
const {
    EmbedBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Botun komutları hakkında detaylı bilgi gösterir.'),
    async execute(interaction) {
        const HelpEmbed = new EmbedBuilder()
            .setColor('Grey')
            .setTitle('Yardım Menüsü')
            .setDescription("Commands ```\n /suggest - Oylama Açar. \n /banner - Kişinin Bannerı varsa gösterir. \n /avatar - Kişinin Profil resmini gösterir. \n /ping - Botun gecikme süresini gösterir. \n /help - Bu dosyayı görüntüler. \n /delete - Belitrilen sayıda ve Belirtilen Kullanıcıdan (Opsiyonel) mesaj siler. ```")

        interaction.reply({
            embeds: [HelpEmbed]
        })
    }
}