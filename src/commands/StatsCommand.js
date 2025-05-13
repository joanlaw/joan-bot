import Command from './Command.js';
import {
  getPlayerIdByName,
  getCurrentSeasonId,
  getSeasonStats,
  getRankedStats
} from '../api/PUBG_API.js';

import { createSeasonStatsEmbed } from '../utils/createSeasonStatsEmbed.js';

export default class StatsCommand extends Command {
  constructor() {
    super('stats', 'Muestra estadísticas de la temporada actual de un jugador de PUBG.');
  }

  async execute({ message, args }) {
    if (!args.length) {
      return message.reply('¡Debes proporcionar un nombre de jugador! Ejemplo: `!stats Joanlaw`');
    }

    const playerName = args.join(' ');
    try {
      const playerId = await getPlayerIdByName(playerName);
      if (!playerId) return message.reply(`No se encontró el jugador "${playerName}".`);

      const seasonId = await getCurrentSeasonId();
      const gameStats = await getSeasonStats(playerId, seasonId);
      const rankedStats = await getRankedStats(playerId, seasonId);

      // Extraer datos clave para el embed
      const stats = {
        tpp: gameStats['squad'], // o 'duo' o 'solo' si prefieres
        fpp: gameStats['squad-fpp'],
        ranked: rankedStats['squad-fpp']
      };

      const embed = createSeasonStatsEmbed(stats, playerName, 'steam', seasonId);

      return message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Error en el comando stats:', error);
      return message.reply('❌ Ocurrió un error al obtener estadísticas del jugador.');
    }
  }
}
