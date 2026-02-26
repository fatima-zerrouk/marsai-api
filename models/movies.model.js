import db from '../config/database.config.js';

export const getAllMoviesWithDirector = async () => {
  const query = `
  SELECT
    m.id,
    m.original_title,
    m.english_title,
    m.language,
    m.duration,
    d.country,
    CONCAT(d.firstname,' ',d.lastname) AS director_name
  FROM movies m
  LEFT JOIN directors d ON m.director_id = d.id
  WHERE m.status = 'approved';
  `;

  const [rows] = await db.query(query);
  return rows;
};