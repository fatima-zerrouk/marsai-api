

import db from "../config/database.config.js";

export const AdminJuryModel = {
  // Récupérer tous les jurés
  async getAllJury() {
    const [rows] = await db.query(`
      SELECT u.id, u.firstname, u.lastname, u.email
      FROM users u
      INNER JOIN roles_users ru ON u.id = ru.user_id
      INNER JOIN roles r ON ru.role_id = r.id
      WHERE r.name = 'Jury'
      ORDER BY u.firstname ASC
    `);
    return rows;
  },

  // Créer un juré
  async createJury({ firstname, lastname, email, password }) {
    // 1. créer l'utilisateur
    const [result] = await db.query(
      `
      INSERT INTO users (firstname, lastname, email, password)
      VALUES (?, ?, ?, ?)
      `,
      [firstname, lastname, email, password]
    );

    const userId = result.insertId;

    // 2. récupérer l'id du rôle Jury
    const [[role]] = await db.query(
      `SELECT id FROM roles WHERE name = 'Jury'`
    );

    // 3. lier user + rôle Jury
    await db.query(
      `
      INSERT INTO roles_users (user_id, role_id)
      VALUES (?, ?)
      `,
      [userId, role.id]
    );

    return { id: userId, firstname, lastname, email };
  },



  // Supprimer un juré
  async deleteJury(userId) {
    await db.query(`
      DELETE FROM roles_users 
      WHERE user_id = ? 
        AND role_id = (SELECT id FROM roles WHERE name = 'Jury')
    `, [userId]);

    await db.query(`
      DELETE FROM users WHERE id = ?
    `, [userId]);
  },

  // Mettre à jour un juré
async updateJury(id, firstname, lastname, email) {
    const [result] = await db.query(
      `UPDATE users SET firstname=?, lastname=?, email=? WHERE id=?`,
      [firstname, lastname, email, id]
    );
    return result;
  }

};
