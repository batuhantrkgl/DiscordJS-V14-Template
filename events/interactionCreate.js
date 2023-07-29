const db = require("orio.db");
module.exports = {
  
    name: 'interactionCreate',
    execute(interaction, client) {

           if (interaction.isButton()) {
             if (interaction.customId === "ticket-kapat") {
              const { guild } = interaction
              const guild_user = `${guild.id}_${interaction.member.id}_tickets`
              db.substract(guild_user, 1)
               interaction.channel.delete();
             }
           }
    },
};