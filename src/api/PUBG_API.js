import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno primero

const API_KEY = process.env.PUBG_API_KEY;
const PLATFORM = 'steam';

console.log('🔐 PUBG_API_KEY cargada correctamente:', API_KEY ? 'Sí' : 'No');

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  Accept: 'application/vnd.api+json'
};

export async function getCurrentSeasonId() {
  try {
    const res = await axios.get(`https://api.pubg.com/shards/${PLATFORM}/seasons`, { headers });
    const seasons = res.data.data;
    const current = seasons.find(season => season.attributes.isCurrentSeason);
    return current.id;
  } catch (error) {
    console.error('❌ Error en getCurrentSeasonId:', error.response?.data || error.message);
    throw error;
  }
}

export async function getSeasonStats(playerId, seasonId) {
  try {
    const res = await axios.get(
      `https://api.pubg.com/shards/${PLATFORM}/players/${playerId}/seasons/${seasonId}`,
      { headers }
    );
    return res.data.data.attributes.gameModeStats;
  } catch (error) {
    console.error('❌ Error en getSeasonStats:', error.response?.data || error.message);
    throw error;
  }
}

export async function getRankedStats(playerId, seasonId) {
  try {
    const res = await axios.get(
      `https://api.pubg.com/shards/${PLATFORM}/players/${playerId}/seasons/${seasonId}/ranked`,
      { headers }
    );
    return res.data.data.attributes.rankedGameModeStats;
  } catch (error) {
    console.error('❌ Error en getRankedStats:', error.response?.data || error.message);
    throw error;
  }
}

export async function getLastMatchId(playerId) {
  try {
    const res = await axios.get(`https://api.pubg.com/shards/${PLATFORM}/players/${playerId}`, { headers });
    const matches = res.data.data.relationships.matches.data;
    return matches?.[0]?.id || null;
  } catch (error) {
    console.error('❌ Error en getLastMatchId:', error.response?.data || error.message);
    throw error;
  }
}

export async function getMatchDetails(matchId, playerId) {
  try {
    const res = await axios.get(`https://api.pubg.com/shards/${PLATFORM}/matches/${matchId}`, { headers });
    const participants = res.data.included.filter(p => p.type === 'participant');
    const playerStats = participants.find(p => p.attributes.stats.playerId === playerId);
    return playerStats?.attributes?.stats || null;
  } catch (error) {
    console.error('❌ Error en getMatchDetails:', error.response?.data || error.message);
    throw error;
  }
}

export async function getWeaponStats(playerId) {
  try {
    const res = await axios.get(
      `https://api.pubg.com/shards/${PLATFORM}/players/${playerId}/weapon_mastery`,
      { headers }
    );
    return res.data.data.attributes.WeaponSummaries;
  } catch (error) {
    console.error('❌ Error en getWeaponStats:', error.response?.data || error.message);
    throw error;
  }
}


export async function getPlayerIdByName(playerName) {
  try {
    console.log(`🔍 Consultando API PUBG para jugador: ${playerName}`);

    const res = await axios.get(
      `https://api.pubg.com/shards/${PLATFORM}/players?filter[playerNames]=${playerName}`,
      { headers }
    );

    console.log('✅ Respuesta de la API recibida:', res.data);

    if (!res.data.data || res.data.data.length === 0) return null;

    return res.data.data[0].id;
  } catch (error) {
    console.error('❌ Error en getPlayerIdByName:', error.response?.data || error.message);
    throw error;
  }
}

export async function getLifetimeStats(playerId) {
  try {
    console.log(`📘 Consultando estadísticas de vida para el jugador ID: ${playerId}`);

    const res = await axios.get(
      `https://api.pubg.com/shards/${PLATFORM}/players/${playerId}/seasons/lifetime`,
      { headers }
    );

    console.log('📈 Respuesta de la API (getLifetimeStats):', res.data);

    return res.data.data.attributes.gameModeStats;
  } catch (error) {
    console.error('❌ Error en getLifetimeStats:', error.response?.data || error.message);
    throw error;
  }

  
}
