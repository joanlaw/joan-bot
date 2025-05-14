import Command from './Command.js';
import { getPlayerIdByName, getCurrentSeasonId, getSeasonStats, getRankedStats } from '../api/PUBG_API.js';
import { createSeasonStatsEmbed } from '../embeds/SeasonStatsEmbed.js';

export default class StatsCommand extends Command {
  constructor() {
    super('stats', 'Muestra estadísticas de la temporada actual de un jugador de PUBG.');
  }

  async execute({ message, args }) {
    if (!args.length) {
      return message.reply('❗ Debes proporcionar un nombre de jugador. Ejemplo: `!stats Joanlaw`');
    }

    const playerName = args.join(' ');
    try {
      const playerId = await getPlayerIdByName(playerName);
      if (!playerId) {
        return message.reply(`⚠️ No se encontró el jugador **${playerName}**.`);
      }

      const seasonId = await getCurrentSeasonId();
      const stats = await getSeasonStats(playerId, seasonId);
      const ranked = await getRankedStats(playerId, seasonId);

      const embed = createSeasonStatsEmbed({
        fpp: stats['squad-fpp'] || stats['duo-fpp'] || stats['solo-fpp'],
        tpp: stats['squad'] || stats['duo'] || stats['solo'],
        ranked: ranked['squad-fpp'] || null
      }, playerName, 'steam', seasonId);

      return message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Error en el comando stats:', error);
      return message.reply('❌ Ocurrió un error al obtener las estadísticas del jugador.');
    }
  }
}
