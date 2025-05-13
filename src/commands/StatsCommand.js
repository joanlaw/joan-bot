  import Command from './Command.js';
  import { getPlayerIdByName, getCurrentSeasonId, getSeasonStats } from '../api/PUBG_API.js';

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
        const stats = await getSeasonStats(playerId, seasonId);

        const modes = {
          'TPP Solo': 'solo',
          'TPP Duo': 'duo',
          'TPP Squad': 'squad',
          'FPP Solo': 'solo-fpp',
          'FPP Duo': 'duo-fpp',
          'FPP Squad': 'squad-fpp',
        };

        let reply = `**📊 Estadísticas de temporada actual para ${playerName}**\n\n`;
        for (const [label, key] of Object.entries(modes)) {
          const m = stats[key];
          if (!m) {
            reply += `**${label}**\n• Sin datos\n\n`;
            continue;
          }

          const {
            kills = 0,
            assists = 0,
            losses = 0,
            roundsPlayed = 0,
            wins = 0,
            damageDealt = 0,
            longestKill = 0,
            headshotKills = 0
          } = m;

          const kd = losses > 0 ? (kills / losses).toFixed(2) : kills.toFixed(2);
          const avgDamage = roundsPlayed > 0 ? (damageDealt / roundsPlayed).toFixed(2) : '0';
          const winRate = roundsPlayed > 0 ? ((wins / roundsPlayed) * 100).toFixed(2) : '0';
          const headshotRate = kills > 0 ? ((headshotKills / kills) * 100).toFixed(2) : '0';

          reply += `**${label}**\n` +
            `• Partidas: ${roundsPlayed}\n` +
            `• K/D: ${kd}\n` +
            `• Asistencias: ${assists}\n` +
            `• Daño promedio: ${avgDamage}\n` +
            `• Longest Kill: ${longestKill.toFixed(1)}m\n` +
            `• Headshots: ${headshotKills} (${headshotRate}%)\n` +
            `• Winrate: ${winRate}%\n\n`;
        }

        return message.reply(reply);
      } catch (error) {
        console.error('❌ Error en el comando stats:', error);
        return message.reply('Ocurrió un error al obtener estadísticas del jugador.');
      }
    }
  }
