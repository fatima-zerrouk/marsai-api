import db from '../config/database.config.js'

export const User = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    return rows[0] || null
  },

  async create({ email, password, firstname, lastname }) {
    const [result] = await db.query(
      'INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)',
      [email, password, firstname, lastname] 
    )
    return { insertId: result.insertId }
  },

  async findAll() {
    const [rows] = await db.query(
      'SELECT id, email, firstname, lastname FROM users' 
    )
    return rows
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, email, firstname, lastname FROM users WHERE id = ?',
      [id]
    )
    return rows[0] || null
  },

  async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id])
  }
}
