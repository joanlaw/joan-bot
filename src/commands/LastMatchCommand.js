import Command from './Command.js';
import { getPlayerIdByName, getLastMatchId, getMatchDetails } from '../api/PUBG_API.js';

export default class LastMatchCommand extends Command {
  constructor() {
    super('lastmatch', 'Muestra información de la última partida del jugador.');
  }

  async execute({ message, args }) {
    if (!args.length) {
      return message.reply('¡Debes proporcionar un nombre de jugador! Ejemplo: `!lastmatch Joanlaw`');
    }

    const playerName = args.join(' ');
    try {
      const playerId = await getPlayerIdByName(playerName);
      if (!playerId) return message.reply(`No se encontró el jugador "${playerName}".`);

      const matchId = await getLastMatchId(playerId);
      if (!matchId) return message.reply(`No se encontró ninguna partida reciente de ${playerName}.`);

      const match = await getMatchDetails(matchId, playerId);
      if (!match) return message.reply('No se pudo encontrar la información de la partida.');

      const {
        kills,
        assists,
        damageDealt,
        timeSurvived,
        winPlace,
        headshotKills
      } = match;

      const minutes = Math.floor(timeSurvived / 60);
      const seconds = Math.floor(timeSurvived % 60);

      const reply = `**🎮 Última partida de ${playerName}**\n\n` +
        `• Posición: #${winPlace}\n` +
        `• Kills: ${kills}\n` +
        `• Asistencias: ${assists}\n` +
        `• Headshots: ${headshotKills}\n` +
        `• Daño: ${damageDealt.toFixed(1)}\n` +
        `• Tiempo sobrevivido: ${minutes}m ${seconds}s`;

      return message.reply(reply);
    } catch (error) {
      console.error('❌ Error en el comando lastmatch:', error);
      return message.reply('Ocurrió un error al obtener la última partida.');
    }
  }
}
