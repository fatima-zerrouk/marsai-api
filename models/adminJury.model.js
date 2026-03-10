import db from '../config/database.config.js';

export const AdminJuryModel = {
  // Récupérer tous les jurés
  async getAllJury() {
    const [rows] = await db.query(`
    SELECT u.id, u.firstname, u.lastname, u.email
    FROM users u
    INNER JOIN roles_users ru ON u.id = ru.user_id
    INNER JOIN roles r ON ru.role_id = r.id
    WHERE r.name = 'Jury'
      AND u.id NOT IN (
        SELECT user_id 
        FROM roles_users 
        WHERE role_id = (SELECT id FROM roles WHERE name = 'Admin')
      )
    ORDER BY u.firstname ASC
  `);
    return rows;
  },
  // Créer un juré
  async createJury({ firstname, lastname, email, password }) {
    // 1️⃣ créer l'utilisateur
    const [result] = await db.query(
      `
    INSERT INTO users (firstname, lastname, email, password, must_change_password)
    VALUES (?, ?, ?, ?, ?)
    `,
      [firstname, lastname, email, password, true]
    );

    const userId = result.insertId;

    // récupérer l'id du rôle Jury
    const [[role]] = await db.query(`SELECT id FROM roles WHERE name = 'Jury'`);

    // lier user + rôle Jury
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
    await db.query(
      `
      DELETE FROM roles_users 
      WHERE user_id = ? 
        AND role_id = (SELECT id FROM roles WHERE name = 'Jury')
    `,
      [userId]
    );

    await db.query(
      `
      DELETE FROM users WHERE id = ?
    `,
      [userId]
    );
  },

  // Mettre à jour un juré
  async updateJury(id, firstname, lastname, email) {
    const [result] = await db.query(
      `UPDATE users SET firstname=?, lastname=?, email=? WHERE id=?`,
      [firstname, lastname, email, id]
    );
    return result;
  },

  // distribuer les films aux jurys
  async distributeMovies() {
    // Récupérer uniquement les vrais jurys
    const [juries] = await db.query(`
    SELECT u.id
    FROM users u
    INNER JOIN roles_users ru ON u.id = ru.user_id
    INNER JOIN roles r ON ru.role_id = r.id
    WHERE r.name = 'Jury'
    AND NOT EXISTS (
      SELECT 1
      FROM roles_users ru2
      INNER JOIN roles r2 ON ru2.role_id = r2.id
      WHERE ru2.user_id = u.id
      AND r2.name = 'Admin'
    )
  `);

    const [movies] = await db.query(`
      SELECT id FROM movies
  `);

    if (!juries.length || !movies.length) {
      throw new Error('Pas assez de jurys ou de films');
    }

    // Reset complet avant redistribution
    await db.query(`DELETE FROM jury_movies`);

    // Mélange aléatoire
    const shuffled = movies.sort(() => 0.5 - Math.random());

    // Distribution circulaire parfaite
    for (let i = 0; i < shuffled.length; i++) {
      const juryIndex = i % juries.length;

      await db.query(
        `INSERT INTO jury_movies (jury_id, movie_id) VALUES (?, ?)`,
        [juries[juryIndex].id, shuffled[i].id]
      );
    }

    return { message: 'Distribution effectuée avec succès' };
  },

  // AdminJuryModel.js
  async getDistributions() {
    const [rows] = await db.query(`
    SELECT u.firstname AS juryName, GROUP_CONCAT(m.original_title) AS movies
    FROM jury_movies jm
    JOIN users u ON jm.jury_id = u.id
    JOIN movies m ON jm.movie_id = m.id
    GROUP BY u.id
  `);

    // Transforme la string CSV en tableau
    return rows.map(r => ({
      juryName: r.juryName,
      movies: r.movies ? r.movies.split(',') : [],
    }));
  },
};
