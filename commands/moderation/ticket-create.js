

const {
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
    ButtonStyle,
    ComponentType,
    PermissionFlagsBits,
} = require('discord.js')
const db = require("orio.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-main')
        .setDescription('Sends a main ticket embed - need administrator permissions.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('embed-message')
            .setDescription('Ticketta Gözükücek Alt Yazı.')
            .setRequired(false)),

    async execute(interaction) {
        const {
            guild
        } = interaction
        const veri = interaction.options.getString("ad")
        const mesaj = interaction.options.getString("embed-message") || "Bu Sunucuda Ticket Destek Talebi Açarak\nSorunlarınızı, Önerilerinizi Belirtebilirsiniz."

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`${guild.name} Sunucusu İçin Destek Talebi Aç!`)
            .setFooter({
                text: `Batuhantrkgl ♡ Discord.js`
            })
            .setDescription(`${mesaj}`)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket-olustur')
                .setLabel('Ticket Oluştur!')
                .setStyle(ButtonStyle.Success)
                .setEmoji("972823566238228560")
            )
        await interaction.deferReply()
        await interaction.editReply({
            embeds: [embed],
            components: [row]
        })

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 600000
        });

        collector.on('collect', async i => {
            if (i.customId === 'ticket-olustur') {

                const guild_user = `${guild.id}_${i.member.id}`
                const guild_user_tickets = `${guild.id}_${i.member.id}_tickets`
                console.log(db.get(guild_user_tickets))
                if (db.has(`${guild_user}`)) {
                    let blacklist_already_embed = new EmbedBuilder()
                        .setColor('NotQuiteBlack')
                        .setTitle("Yetkililer Seni Blackliste Ekledi, Ticket Komudunu Kullanamazsın!")
                    //                      interaction.deferReply()
                    i.reply({
                        embeds: [blacklist_already_embed],
                        ephemeral: true
                    })
                } else if (db.get(guild_user_tickets) > 0) {
                    let higherthan3 = new EmbedBuilder()
                        .setColor('NotQuiteBlack')
                        .setTitle("You Have Reached The Maximum Number Of Tickets!")
                        .setDescription("Please Close Some Tickets For Open New Ticket.")
                    i.reply({
                        embeds: [higherthan3],
                        ephemeral: true
                    })


                } else {

                    const embed1 = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Ticket Oluşturuldu!')
                        .setDescription(`Merhaba ${i.member.user},\nDestek Talebiniz Oluşturuldu! `);
                    await i.reply({
                        embeds: [embed1],
                        ephemeral: true
                    });
                    await i.fetchReply()
                    const embed234 = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle("Ticket Oluşturma")
                        .setDescription(`Merhaba <@!${i.member.id}>,\nYetkililer Sizinle Birazdan İletişime Geçicek`);



                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('ticket-kapat')
                            .setLabel('Kanalı Kapat.')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("946070767014121523")
                        )
                    db.add(guild_user_tickets, 1)
                    await i.guild.channels.create({ name: `${i.member.user.username}-desktek-talebi`}, {
                            type: 'GUILD_TEXT',
                            permissionOverwrites: [{
                                    id: i.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel],
                                    deny: [],
                                    type: "member"
                                },
                                {
                                    id: i.guild.roles.everyone.id,
                                    allow: [],
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                    type: "role"
                                },
                            ]
                        }).then(c => c.send({
                            content: `<@!${i.member.id}>`,
                            embeds: [embed234],
                            components: [row1]
                        }))
                        .then(reply => console.log(reply.id))
                        .catch(console.error);
                }
            }
        });

    }

}