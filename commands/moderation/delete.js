const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const {
  PermissionsBitField,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Belirli sayıda mesajı siler.')
    .addIntegerOption(option =>
      option
      .setName('number')
      .setDescription('Kaç mesajı silmek istediğinizi belirtin.')
      .setRequired(true)
    )
    .addUserOption(option =>
      option
      .setName('user')
      .setDescription('Belirli bir kullanıcının mesajlarını silmek isterseniz kullanıcının adını belirtin.')
    ),
  async execute(interaction) {
    // Komutu kullanan kişinin yetkisini kontrol edin (Opsiyonel - İsteğe bağlı).
    if (!interaction.member.permissions.has(PermissionsBitField.ManageMessages)) {
      return interaction.reply('Bu komutu kullanmak için yeterli yetkiniz yok.');
    }

    // Slash Command'dan gelen parametreleri alın.
    const sayi = interaction.options.getInteger('sayi');
    const kullanici = interaction.options.getUser('kullanici');

    try {
      // Mesajları silme işlemi.
      const fetchedMessages = await interaction.channel.messages.fetch({
        limit: 100
      });
      const messagesToDelete = kullanici ?
        fetchedMessages.filter(msg => msg.author.id === kullanici.id).first(sayi) :
        fetchedMessages.first(sayi);

      if (!messagesToDelete || messagesToDelete.size === 0) {
        return interaction.reply('Silinmesi gereken mesaj bulunamadı.');
      }

      await interaction.channel.bulkDelete(messagesToDelete, true);

      // Geri bildirimi kullanıcıya gönderin.
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`Başarıyla ${sayi} mesaj silindi.`);

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    } catch (error) {
      console.error('Mesajları silerken bir hata oluştu:', error);
      return interaction.reply('Mesajları silerken bir hata oluştu.');
    }
  },
};