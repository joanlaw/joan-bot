import Command from './Command.js';
import { getPlayerIdByName, getWeaponStats } from '../api/PUBG_API.js';

export default class WeaponCommand extends Command {
  constructor() {
    super(
      'weapon',
      'Muestra estadísticas de maestría de armas para un jugador.\nUso: !weapon Nombre [daño|kills|nivel|nombreArma]'
    );
  }

  async execute({ message, args }) {
    if (args.length === 0) {
      return message.reply('Uso: `!weapon NombreJugador [daño|kills|nivel|nombreArmaOpcional]`');
    }

    const playerName = args[0];
    const sortOrFilter = args[1]?.toLowerCase(); // puede ser "daño", "kills", "nivel" o nombre de arma

    try {
      const playerId = await getPlayerIdByName(playerName);
      if (!playerId) return message.reply(`No se encontró el jugador "${playerName}".`);

      const weapons = await getWeaponStats(playerId);
      if (!weapons || Object.keys(weapons).length === 0) {
        return message.reply(`No hay datos de maestría de armas para "${playerName}".`);
      }

      let weaponEntries = Object.entries(weapons);

      // Filtro si el usuario pidió una sola arma por nombre
      if (sortOrFilter && !['daño', 'kills', 'nivel'].includes(sortOrFilter)) {
        weaponEntries = weaponEntries.filter(([name]) =>
          name.toLowerCase().includes(sortOrFilter)
        );

        if (weaponEntries.length === 0) {
          return message.reply(`No se encontró ninguna arma que coincida con "${sortOrFilter}".`);
        }
      } else {
        // Ordenamiento
        weaponEntries.sort(([, aData], [, bData]) => {
          const a = aData.StatsTotal || {};
          const b = bData.StatsTotal || {};

          if (sortOrFilter === 'kills') {
            return (b.Kills || 0) - (a.Kills || 0);
          } else if (sortOrFilter === 'nivel') {
            return (b.Level || 0) - (a.Level || 0);
          } else {
            return (b.DamagePlayer || 0) - (a.DamagePlayer || 0); // daño por defecto
          }
        });
      }

      const replyList = weaponEntries.slice(0, 5).map(([name, data]) => {
        const { Tier = 'N/A', Level = 0, Kills = 0, HeadshotKills = 0, DamagePlayer = 0 } = data.StatsTotal || {};
        return `• **${name.replace('Item_', '')}**\n` +
               `   • Nivel: ${Level} (${Tier})\n` +
               `   • Kills: ${Kills}\n` +
               `   • Headshots: ${HeadshotKills}\n` +
               `   • Daño: ${DamagePlayer.toFixed(1)}\n`;
      });

      const criterio = sortOrFilter && ['kills', 'nivel'].includes(sortOrFilter) ? sortOrFilter : 'daño';
      let reply = `**🔫 Top 5 armas de ${playerName} ordenadas por ${criterio}**\n\n` + replyList.join('\n');
      return message.reply(reply);
    } catch (error) {
      console.error('❌ Error en el comando weapon:', error);
      return message.reply('Ocurrió un error al obtener estadísticas de armas.');
    }
  }
}
