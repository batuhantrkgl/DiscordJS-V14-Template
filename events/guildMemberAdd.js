const {
  WebhookClient,
  GuildMember,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  /**
   * @param {GuildMember} member
   */
  execute(member) {
    const {
      user,
      guild
    } = member;

    member.roles.add("1134021428010811572")

    const welcomer = new WebhookClient({
      id: '1134784413742411796',
      token: 'vjaA0e2vTsHGhWJrKaRQmqqhsJf_-acT0YTFpcLast2zcmMPQTVpJ6NTVijvo3FETZsN'
    })
    const welcome = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({
        // This is the object that will be passed to the `setAuthor` method.
        name: user.username,
        url: user.avatarURL({
          size: 512
        })
      })
      .setThumbnail(user.avatarURL({
        size: 512
      }))
      .setDescription(`
         **${guild.name}** Sunucusuna Hoşgeldin ${member}!\n Hesap Kuruluş Tarihi: <t:${parseInt(user.createdTimestamp /1000 )}:R>\nArtık **${guild.memberCount}** Kişiyiz\n <@1133807585489846382> Rölü Eklendi! `)
      .setFooter({
        // This is the object that will be passed to the `setFooter` method.
        text: 'ID: ' + user.id
      })

    welcomer.send({
      embeds: [welcome]
    })
  }
}