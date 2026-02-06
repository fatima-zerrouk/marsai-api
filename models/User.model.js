
import db from '../config/database.config.js'

export const User = {

  // ───────────────────────────────────────────────
  // FIND BY EMAIL + ROLES
  // ───────────────────────────────────────────────
  async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT u.*, r.name AS role
       FROM users u
       LEFT JOIN roles_users ru ON u.id = ru.user_id
       LEFT JOIN roles r ON ru.role_id = r.id
       WHERE u.email = ?`,
      [email]
    )

    if (rows.length === 0) return null

    const user = {
      id: rows[0].id,
      email: rows[0].email,
      password: rows[0].password,
      firstname: rows[0].firstname,
      lastname: rows[0].lastname,
      roles: rows.map(r => r.role).filter(Boolean)
    }

    return user
  },


  async addRoleByName(userId, roleName) {
  const [[role]] = await db.query(
    'SELECT id FROM roles WHERE name = ?',
    [roleName]
  )

  if (!role) return

  await db.query(
    'INSERT IGNORE INTO roles_users (user_id, role_id) VALUES (?, ?)',
    [userId, role.id]
  )
},

// ───────────────────────────────────────────────
// CREATE USER (avec rôle par défaut "jury")
// ───────────────────────────────────────────────
async create({ email, password, firstname, lastname }) {
  const [result] = await db.query(
    'INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)',
    [email, password, firstname, lastname]
  )

  const userId = result.insertId

  // Assigner le rôle "user" par défaut
  const [roles] = await db.query('SELECT id FROM roles WHERE name = ?', ['jury'])
  if (roles.length) {
    await db.query('INSERT INTO roles_users (user_id, role_id) VALUES (?, ?)', [userId, roles[0].id])
  }

  return { insertId: userId }
}
,

  // ───────────────────────────────────────────────
  // UPDATE USER
  // ───────────────────────────────────────────────
  async update(id, data) {
    const { email, password, firstname, lastname } = data

    await db.query(
      `UPDATE users 
       SET email = ?, 
           password = COALESCE(?, password), 
           firstname = ?, 
           lastname = ?
       WHERE id = ?`,
      [email, password, firstname, lastname, id]
    )
  },

  // ───────────────────────────────────────────────
  // FIND ALL USERS + ROLES
  // ───────────────────────────────────────────────
  async findAll() {
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.firstname, u.lastname, r.name AS role
       FROM users u
       LEFT JOIN roles_users ru ON u.id = ru.user_id
       LEFT JOIN roles r ON ru.role_id = r.id`
    )

    // Regrouper par user
    const users = {}
    rows.forEach(row => {
      if (!users[row.id]) {
        users[row.id] = {
          id: row.id,
          email: row.email,
          firstname: row.firstname,
          lastname: row.lastname,
          roles: []
        }
      }
      if (row.role) users[row.id].roles.push(row.role)
    })

    return Object.values(users)
  },

  // ───────────────────────────────────────────────
  // FIND BY ID + ROLES
  // ───────────────────────────────────────────────
  async findById(id) {
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.firstname, u.lastname, r.name AS role
       FROM users u
       LEFT JOIN roles_users ru ON u.id = ru.user_id
       LEFT JOIN roles r ON ru.role_id = r.id
       WHERE u.id = ?`,
      [id]
    )

    if (rows.length === 0) return null

    return {
      id: rows[0].id,
      email: rows[0].email,
      firstname: rows[0].firstname,
      lastname: rows[0].lastname,
      roles: rows.map(r => r.role).filter(Boolean)
    }
  },

  // ───────────────────────────────────────────────
  // DELETE USER
  // ───────────────────────────────────────────────
  async delete(id) {
    await db.query('DELETE FROM roles_users WHERE user_id = ?', [id])
    await db.query('DELETE FROM users WHERE id = ?', [id])
  },

  // ───────────────────────────────────────────────
  // ASSIGN ROLE
  // ───────────────────────────────────────────────
  async addRole(userId, roleId) {
    await db.query(
      'INSERT INTO roles_users (user_id, role_id) VALUES (?, ?)',
      [userId, roleId]
    )
  },

  // ───────────────────────────────────────────────
  // REMOVE ROLE
  // ───────────────────────────────────────────────
  async removeRole(userId, roleId) {
    await db.query(
      'DELETE FROM roles_users WHERE user_id = ? AND role_id = ?',
      [userId, roleId]
    )
  }
}