import db from '../config/database.config.js';

/**
 * Récupère tous les films avec leur note moyenne, nombre de votes, auteur et pays
 */
export const getAllMovies = async () => {
  const query = `
    SELECT 
      m.id,
      m.original_title,
      m.english_title,
      m.cover_image,
      m.duration,
      m.language,
      m.director_id,
      m.status,
      m.is_finalist,
      CONCAT(d.firstname, ' ', d.lastname) AS author,
      d.country AS country,
      COALESCE(ROUND(AVG(r.rate), 1), 0) AS score,
      COUNT(r.id) AS votes
    FROM movies m
    LEFT JOIN ratings r ON r.movie_id = m.id
    LEFT JOIN directors d ON d.id = m.director_id
    GROUP BY m.id
    ORDER BY score DESC
  `;

  const [rows] = await db.execute(query);
  return rows;
};

/**
 * Récupère un film par son ID avec sa note moyenne, auteur et pays
 */
export const getMovieById = async id => {
  const query = `
    SELECT 
      m.id,
      m.original_title,
      m.english_title,
      m.cover_image,
      m.duration,
      m.language,
      m.director_id,
      m.status,
      m.is_finalist,
      CONCAT(d.firstname, ' ', d.lastname) AS author,
      d.country AS country,
      COALESCE(ROUND(AVG(r.rate), 1), 0) AS score,
      COUNT(r.id) AS votes
    FROM movies m
    LEFT JOIN ratings r ON r.movie_id = m.id
    LEFT JOIN directors d ON d.id = m.director_id
    WHERE m.id = ?
    GROUP BY m.id
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
};
