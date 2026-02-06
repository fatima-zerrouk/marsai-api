
import db from "../config/database.config.js"

export const Dashboard = {

  // ───────────────────────────────────────────────
  // Films évalués
  // ───────────────────────────────────────────────
  async getFilmsReviewed() {
    const [[filmsReviewed]] = await db.query(
      "SELECT COUNT(DISTINCT movie_id) AS reviewed FROM ratings"
    )
    const [[filmsTotal]] = await db.query(
      "SELECT COUNT(*) AS total FROM movies"
    )
    const percentage = filmsTotal.total === 0 
      ? 0 
      : ((filmsReviewed.reviewed / filmsTotal.total) * 100).toFixed(1)

    return { count: filmsReviewed.reviewed, target: filmsTotal.total, percentage }
  },

  // ───────────────────────────────────────────────
  // Jurés actifs
  // ───────────────────────────────────────────────
  async getJurorsStats() {
    const [[active]] = await db.query(`
      SELECT COUNT(DISTINCT r.user_id) AS active
      FROM ratings r
      JOIN roles_users ru ON ru.user_id = r.user_id
      JOIN roles ro ON ro.id = ru.role_id
      WHERE ro.name = 'Jury'
    `)
    const [[total]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM roles_users ru
      JOIN roles ro ON ro.id = ru.role_id
      WHERE ro.name = 'Jury'
    `)

    return { active: active.active, total: total.total, status: "En cours de délibération" }
  },

// ───────────────────────────────────────────────
// Pays représentés
// ───────────────────────────────────────────────
async getCountries() {
  const [[countries]] = await db.query(
    "SELECT COUNT(DISTINCT country) AS count FROM movies"
  )

  return {
    count: countries.count,
    topZone: "Europe" // temporaire / mock
  }
},


  // ───────────────────────────────────────────────
  // Taux d’occupation workshops
  // ───────────────────────────────────────────────
  async getWorkshops() {
    const [[workshops]] = await db.query(`
      SELECT IFNULL(SUM(b.quantity) / SUM(e.capacity) * 100, 0) AS occupancy
      FROM bookings b
      JOIN events e ON e.id = b.event_id
      WHERE e.type = 'workshop'
    `)
    return { occupancy: Math.round(workshops.occupancy) }
  },

  // ───────────────────────────────────────────────
  // Réalisateurs actifs
  // ───────────────────────────────────────────────
  async getDirectorsStats() {
    const [[directors]] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS active FROM movies"
    )
    const [[today]] = await db.query(
      "SELECT COUNT(*) AS todayIncrease FROM movies WHERE DATE(created_at) = CURDATE()"
    )
    return { active: directors.active, todayIncrease: today.todayIncrease }
  }
}
