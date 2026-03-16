import db from '../config/database.config.js';

export const Dashboard = {
  async getMoviesStats() {
    // nombre total de films soumis
    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM movies'
    );

    // films évalués par au moins un jury
    const [[{ evaluated }]] = await db.query(
      'SELECT COUNT(DISTINCT movie_id) AS evaluated FROM ratings'
    );

    // pourcentage
    const progress = total > 0 ? Math.round((evaluated / total) * 100) : 0;

    return {
      total: Number(total) || 0,
      evaluated: Number(evaluated) || 0,
      progress,
    };
  },

  async getJuryStats() {
    const [[result]] = await db.query(
      'SELECT COUNT(DISTINCT user_id) AS finishedJury FROM ratings'
    );
    return { finishedJury: Number(result.finishedJury) || 0 };
  },

  async getCountries() {
    const [[result]] = await db.query(
      'SELECT COUNT(DISTINCT country) AS count FROM directors'
    );

    return {
      count: Number(result.count) || 0,
      topZone: result.count > 0 ? 'Europe' : null,
    };
  },

  async getWorkshopsOccupancy() {
    return { occupancy: 0 };
  },

  async getDirectorsStats() {
    const [[result]] = await db.query(
      'SELECT COUNT(*) AS count FROM directors'
    );

    return {
      activeCount: Number(result.count) || 0,
      todayIncrease: 0,
    };
  },
};
