import db from '../config/database.config.js'

export const Dashboard = {

  async getMoviesCount() {
    const [[result]] = await db.query(
      'SELECT COUNT(*) AS count FROM movies'
    )
    return { count: Number(result.count) || 0 }
  },

  async getJuryStats() {
    const [[result]] = await db.query(
      'SELECT COUNT(DISTINCT user_id) AS finishedJury FROM ratings'
    )
    return { finishedJury: Number(result.finishedJury) || 0 }
  },

  async getCountries() {
    const [[result]] = await db.query(
      'SELECT COUNT(DISTINCT country) AS count FROM directors'
    )
    return {
      count: Number(result.count) || 0,
      topZone: result.count > 0 ? "Europe" : null
    }
  },

  async getWorkshopsOccupancy() {
    return { occupancy: 0 }
  },

  async getDirectorsStats() {
    const [[result]] = await db.query(
      'SELECT COUNT(*) AS count FROM directors'
    )

    return {
      activeCount: Number(result.count) || 0,
      todayIncrease: 0
    }
  }

}
