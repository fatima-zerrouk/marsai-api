import db from '../config/database.config.js';

export const getAllMovies = async () => {
  const [rows] = await db.query(
    'SELECT * FROM movies ORDER BY submitted_at DESC'
  );
  return rows;
};

export const getMovieById = async id => {
  const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
  return rows[0];
};

export const createMovie = async movie => {
  const {
    original_title,
    english_title,
    youtube_url,
    duration,
    language,
    original_synopsis,
    english_synopsis,
    creative_process,
    ia_tools,
    has_subs,
    srt,
    status,
    is_finalist,
    user_id,
  } = movie;
  const [result] = await db.query(
    `INSERT INTO movies 
    (original_title, english_title, youtube_url, duration, language, original_synopsis, english_synopsis, creative_process, ia_tools, has_subs, srt, status, is_finalist, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      original_title,
      english_title,
      youtube_url,
      duration,
      language,
      original_synopsis,
      english_synopsis,
      creative_process,
      ia_tools,
      has_subs,
      srt,
      status,
      is_finalist,
      user_id,
    ]
  );
  return getMovieById(result.insertId);
};

export const updateMovie = async (id, movie) => {
  const keys = Object.keys(movie);
  const values = Object.values(movie);

  const setQuery = keys.map(k => `${k} = ?`).join(', ');

  await db.query(`UPDATE movies SET ${setQuery} WHERE id = ?`, [...values, id]);
  return getMovieById(id);
};

export const deleteMovie = async id => {
  const [result] = await db.query('DELETE FROM movies WHERE id = ?', [id]);
  return result.affectedRows;
};

export const getMovieWithDirectorById = async id => {
  const [rows] = await db.query(
    `SELECT m.original_title, m.status, d.email, d.firstname
     FROM movies m
     JOIN directors d ON m.director_id = d.id
     WHERE m.id = ?`,
    [id]
  );

  return rows[0] || null;
};

export const toggleMovieVisibility = async id => {
  const [movie] = await db.query('SELECT is_visible FROM movies WHERE id = ?', [
    id,
  ]);

  if (!movie.length) {
    return null;
  }

  const newVisibility = movie[0].is_visible ? 0 : 1;

  await db.query('UPDATE movies SET is_visible = ? WHERE id = ?', [
    newVisibility,
    id,
  ]);

  return { message: 'Visibilité modifiée' };
};

export const getPublicMovies = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM movies
    WHERE status = 'approved'
    AND is_visible = 1
    ORDER BY submitted_at DESC
  `);

  return rows;
};
