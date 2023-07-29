const {
    SlashCommandBuilder
} = require('@discordjs/builders')
const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ComponentType
} = require('discord.js')
const fs = require('node:fs')
const db = require('orio.db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Otomatik Çekiliş Komutu (sanırsam)')
        .addStringOption(option =>
            option.setName('konu')
            .setDescription('Çekişiş konusu yazınız..')
            .setRequired(true)),

    async execute(interaction) {

        const cekilismessage = interaction.options.get("konu")?.value

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('katil')
                .setLabel('Çekilişe Katıl!')
                .setStyle(ButtonStyle.Success)
                .setEmoji("946070953719373855")
            )

        const GiveawayEmbed = new EmbedBuilder()
            .setTitle('Yeni bir çekiliş belirdi!')
            .setDescription(cekilismessage)
            .setFooter({
                text: "Çekilişler 24 Saat sonra belirlenir."
            })

        interaction.reply({
            embeds: [GiveawayEmbed],
            components: [row]
        })

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 86400000
        });

        collector.on('collect', async i => {
            if (i.customId === 'katil') {
                if (db.has(`${i.member.id}_cekiliş_${interaction.id}`) == true) {
                    await i.reply("Bu çekilişe zaten katılmışsın!", { ephemeral: true })
                } else {
                    db.add(`${i.member.id}_cekiliş_${interaction.id}`, i.member.id)
                    fs.writeFileSync(`${interaction.id}_giveaway`, i.member.id)
                    const katildinembed = new EmbedBuilder()
                        .setDescription('Katıldın!')
                    await i.reply({
                        embeds: [katildinembed],
                        ephemeral: true
                    })
                }
            }
        })

        collector.on('end', collected => {

            const katilanlar = fs.readFileSync(`${interaction.id}_giveaway.txt`)
            const kazananuser = katilanlar[Math.floor(Math.random() * katilanlar.lenght)]

            const embed = new EmbedBuilder()
                .setName('Çekiliş Bitti 🎊')
                .setDescription(`Kazanan: <@${kazananuser}>, Tebrikler!`)
                .setTimestamp()

            interaction.editReply({
                embeds: [embed]
            })
        });

    }
}