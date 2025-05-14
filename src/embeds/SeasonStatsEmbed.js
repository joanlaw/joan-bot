import { EmbedBuilder } from 'discord.js';

export function createSeasonStatsEmbed(stats, playerName, platform, season) {
  const embed = new EmbedBuilder()
    .setTitle(`📊 Estadísticas de ${playerName}`)
    .setDescription(`Temporada: **${season}**\nPlataforma: **${platform.toUpperCase()}**`)
    .setColor(0x1e90ff)
    .setFooter({ text: 'Fuente: API Oficial de PUBG' })
    .setTimestamp();

  const safe = (val, decimals = 1) => typeof val === 'number' ? val.toFixed(decimals) : 'N/A';

  if (stats.fpp) {
    embed.addFields(
      { name: '🟦 Modo FPP', value: '\u200B' },
      { name: 'Partidas', value: `${stats.fpp.roundsPlayed ?? 'N/A'}`, inline: true },
      { name: 'Kills', value: `${stats.fpp.kills ?? 'N/A'}`, inline: true },
      { name: 'Win Rate', value: `${safe(stats.fpp.winRatio * 100)}%`, inline: true },
      { name: 'KD', value: `${safe(stats.fpp.kdRatio, 2)}`, inline: true },
      { name: 'Daño Promedio', value: `${safe(stats.fpp.damageDealtAvg)}`, inline: true }
    );
  }

  if (stats.tpp) {
    embed.addFields(
      { name: '\u200B', value: '\u200B' },
      { name: '🟩 Modo TPP', value: '\u200B' },
      { name: 'Partidas', value: `${stats.tpp.roundsPlayed ?? 'N/A'}`, inline: true },
      { name: 'Kills', value: `${stats.tpp.kills ?? 'N/A'}`, inline: true },
      { name: 'Win Rate', value: `${safe(stats.tpp.winRatio * 100)}%`, inline: true },
      { name: 'KD', value: `${safe(stats.tpp.kdRatio, 2)}`, inline: true },
      { name: 'Daño Promedio', value: `${safe(stats.tpp.damageDealtAvg)}`, inline: true }
    );
  }

  if (stats.ranked) {
    embed.addFields(
      { name: '\u200B', value: '\u200B' },
      { name: '🏆 Modo Ranked', value: '\u200B' },
      { name: 'Tier', value: stats.ranked.currentTier ?? 'N/A', inline: true },
      { name: 'Puntos', value: `${stats.ranked.currentRating ?? 'N/A'}`, inline: true },
      { name: 'Partidas', value: `${stats.ranked.roundsPlayed ?? 'N/A'}`, inline: true },
      { name: 'KD', value: `${safe(stats.ranked.kdRatio, 2)}`, inline: true }
    );
  }

  return embed;
}
