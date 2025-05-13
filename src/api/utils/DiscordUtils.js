export default class DiscordUtils {
    static async sendEmbed(message, embedOptions) {
      try {
        await message.channel.send({ embeds: [embedOptions] });
      } catch (error) {
        console.error('Error enviando embed:', error);
        throw error;
      }
    }
  
    static async getGuild(guildId) {
      const { Guild, Intents } = require('discord.js');
      return new Guild(guildId, {
        intents: [Intents.FLAGS.GUILDS]
      });
    }
  }
  