const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Discord,
    ButtonStyle,
    ComponentType
} = require('discord.js');
const db = require('orio.db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oylama')
        .setDescription('Oylama yapar.')
        .addStringOption(option =>
            option.setName('konu')
            .setDescription('Oylama Konusunu Yazınız.')
            .setRequired(true)),
    async execute(interaction, args, message, client) {


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('destek')
                .setLabel('Destekliyorum')
                .setStyle(ButtonStyle.Success)
                .setEmoji("946070953719373855")
            )


            .addComponents(
                new ButtonBuilder()
                .setCustomId('destekleme')
                .setLabel('Desteklemiyorum')
                .setStyle(ButtonStyle.Danger)
                .setEmoji("946070767014121523"),
            )


        db.set(`${interaction.user.id}_suggest_${interaction.id}`, 1)
        const durum = db.get(`${interaction.user.id}_suggest_${interaction.id}`)

        let Embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({
                name: `${interaction.user.tag} Adlı Kişinin Oylaması`,
                iconURL: ` ${interaction.user.avatarURL().replace('webp','gif')} `
            })
            .setDescription(`${interaction.options.get("konu")?.value}`)
            .setFooter({
                text: `Oylama Durumu: ${durum} | Butonlara Basarak Oy Kullanabilirsiniz.`
            })
        await interaction.reply({
            embeds: [Embed],
            components: [row]
        });




        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 600000
        });

        collector.on('collect', async i => {
            const durum = db.get(`${interaction.user.id}_suggest_${interaction.id}`)
            if (i.customId === 'destek') {
                if (db.has(`${i.member.id}_onay_${interaction.id}`) == true || i.member.id == interaction.member.id) {
                    const youcant = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("You cant vote more.")

                    await i.reply({
                        embeds: [youcant],
                        ephemeral: true
                    })
                } else {
                    db.set(`${i.member.id}_onay_${interaction.id}`, 1)
                    if (db.has(`${i.member.id}_red_${interaction.id}`) == true) {
                        db.delete(`${i.member.id}_red_${interaction.id}`)
                    }
                    const embed1 = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Oylama')
                        .setDescription(`Merhaba ${interaction.member.user},\nBaşarı İle Destekliyorum oyunu kullandınız `);
                    await i.reply({
                        embeds: [embed1],
                        ephemeral: true
                    });
                    await db.add(`${interaction.user.id}_suggest_${interaction.id}`, 1)
                    const updated_embed = new EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({
                            name: `${interaction.user.tag} Adlı Kişinin Oylaması`,
                            iconURL: ` ${interaction.user.avatarURL().replace('webp','gif')} `
                        })
                        .setDescription(`${interaction.options.get("konu")?.value}`)
                        .setFooter({
                            text: `Oylama Durumu: ${db.get(`${interaction.user.id}_suggest_${interaction.id}`)} | Butonlara Basarak Oy Kullanabilirsiniz.`
                        })
                    await interaction.editReply({
                        embeds: [updated_embed],
                        components: [row]
                    })
                    await i.fetchReply()
                        .then(reply => console.log(reply.id))
                        .catch(console.error);
                }
            } else if (i.customId === 'destekleme') {
                if (db.has(`${i.member.id}_red_${interaction.id}`) == true || i.member.id == interaction.member.id) {

                    const youcant = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("You cant vote more.")
                    await i.reply({
                        embeds: [youcant],
                        ephemeral: true
                    })

                } else {
                    if (db.has(`${i.member.id}_onay_${interaction.id}`) == true) {
                        await db.delete(`${i.member.id}_onay_${interaction.id}`)
                    }
                    await db.set(`${i.member.id}_red_${interaction.id}`, 1)
                    await db.substract(`${interaction.user.id}_suggest_${interaction.id}`, 1)
                    const embed2 = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Oylama')
                        .setDescription(`Merhaba ${interaction.member.user},\nBaşarı İle Desteklemiyorum oyunu kullandınız `);
                    await i.reply({
                        embeds: [embed2],
                        ephemeral: true
                    });
                    const updated_embed = new EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({
                            name: `${interaction.user.tag} Adlı Kişinin Oylaması`,
                            iconURL: ` ${interaction.user.avatarURL().replace('webp','gif')} `
                        })
                        .setDescription(`${interaction.options.get("konu")?.value}`)
                        .setFooter({
                            text: `Oylama Durumu: ${db.get(`${interaction.user.id}_suggest_${interaction.id}`)} | Butonlara Basarak Oy Kullanabilirsiniz.`
                        })

                    await interaction.editReply({
                        embeds: [updated_embed],
                        components: [row]
                    })

                }
            }
        });


        collector.on('end', collected => interaction.editReply({
            components: []
        }));


    }
}