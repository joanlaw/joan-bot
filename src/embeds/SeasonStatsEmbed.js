import { EmbedBuilder } from 'discord.js';

/**
 * Crea un embed con las estadísticas de temporada actual.
 * @param {Object} stats - Datos del jugador (FPP, TPP, Ranked).
 * @param {string} playerName - Nombre del jugador.
 * @param {string} platform - Plataforma (steam, etc.).
 * @param {string} season - Temporada actual.
 * @returns {EmbedBuilder}
 */
export function createSeasonStatsEmbed(stats, playerName, platform, season) {
  const embed = new EmbedBuilder()
    .setTitle(`📊 Estadísticas de ${playerName}`)
    .setDescription(`Temporada: **${season}**\nPlataforma: **${platform.toUpperCase()}**`)
    .setColor(0x1e90ff)
    .setFooter({ text: 'Fuente: API Oficial de PUBG' })
    .setTimestamp();

  if (stats.fpp) {
    embed.addFields(
      { name: '🟦 Modo FPP', value: '\u200B' },
      { name: 'Partidas', value: `${stats.fpp.roundsPlayed}`, inline: true },
      { name: 'Kills', value: `${stats.fpp.kills}`, inline: true },
      { name: 'Win Rate', value: `${(stats.fpp.winRatio * 100).toFixed(1)}%`, inline: true },
      { name: 'KD', value: `${stats.fpp.kdRatio.toFixed(2)}`, inline: true },
      { name: 'Daño Promedio', value: `${stats.fpp.damageDealtAvg.toFixed(1)}`, inline: true }
    );
  }

  if (stats.tpp) {
    embed.addFields(
      { name: '\u200B', value: '\u200B' },
      { name: '🟩 Modo TPP', value: '\u200B' },
      { name: 'Partidas', value: `${stats.tpp.roundsPlayed}`, inline: true },
      { name: 'Kills', value: `${stats.tpp.kills}`, inline: true },
      { name: 'Win Rate', value: `${(stats.tpp.winRatio * 100).toFixed(1)}%`, inline: true },
      { name: 'KD', value: `${stats.tpp.kdRatio.toFixed(2)}`, inline: true },
      { name: 'Daño Promedio', value: `${stats.tpp.damageDealtAvg.toFixed(1)}`, inline: true }
    );
  }

  if (stats.ranked) {
    embed.addFields(
      { name: '\u200B', value: '\u200B' },
      { name: '🏆 Modo Ranked', value: '\u200B' },
      { name: 'Tier', value: stats.ranked.currentTier, inline: true },
      { name: 'Puntos', value: `${stats.ranked.currentRating}`, inline: true },
      { name: 'Partidas', value: `${stats.ranked.roundsPlayed}`, inline: true },
      { name: 'KD', value: `${stats.ranked.kdRatio.toFixed(2)}`, inline: true }
    );
  }

  return embed;
}
