import Command from './Command.js';
import { getPlayerIdByName, getCurrentSeasonId, getRankedStats } from '../api/PUBG_API.js';

export default class RankedStatsCommand extends Command {
  constructor() {
    super('ranked', 'Muestra estadísticas de partidas Ranked en la temporada actual.');
  }

  async execute({ message, args }) {
    if (!args.length) {
      return message.reply('¡Debes proporcionar un nombre de jugador! Ejemplo: `!ranked Joanlaw`');
    }

    const playerName = args.join(' ');
    try {
      const playerId = await getPlayerIdByName(playerName);
      if (!playerId) return message.reply(`No se encontró el jugador "${playerName}".`);

      const seasonId = await getCurrentSeasonId();
      const rankedData = await getRankedStats(playerId, seasonId);

      const stats = rankedData['squad-fpp']; // Puedes adaptar según el modo ranked disponible

      if (!stats) {
        return message.reply(`No hay estadísticas Ranked para ${playerName} en esta temporada.`);
      }

      const {
        roundsPlayed = 0,
        wins = 0,
        kills = 0,
        assists = 0,
        damageDealt = 0,
        kda = 0,
        top10Ratio = 0,
        winRatio = 0,
        currentRankPoint = 0,
        bestRankPoint = 0,
        currentTier,
        bestTier
      } = stats;

      const reply = `**🏆 Estadísticas Ranked (Temporada Actual) para ${playerName}**\n\n` +
        `• Partidas: ${roundsPlayed}\n` +
        `• Wins: ${wins} (${(winRatio * 100).toFixed(2)}%)\n` +
        `• Kills: ${kills}\n` +
        `• Asistencias: ${assists}\n` +
        `• KDA: ${kda.toFixed(2)}\n` +
        `• Daño total: ${damageDealt.toFixed(1)}\n` +
        `• Top 10 Ratio: ${(top10Ratio * 100).toFixed(2)}%\n` +
        `• Puntos actuales: ${currentRankPoint} (${currentTier.tier} ${currentTier.subTier})\n` +
        `• Mejor puntuación: ${bestRankPoint} (${bestTier.tier} ${bestTier.subTier})`;

      return message.reply(reply);
    } catch (error) {
      console.error('❌ Error en el comando ranked:', error);
      return message.reply('Ocurrió un error al obtener estadísticas Ranked del jugador.');
    }
  }
}
