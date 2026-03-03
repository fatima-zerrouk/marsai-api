import db from '../config/database.config.js';

const create = async (rate, userId, movieId) => {
  const sql = 'INSERT INTO ratings (rate, user_id, movie_id) VALUES (?, ?, ?)';
  const [result] = await db.query(sql, [rate, userId, movieId]);
  return result;
};

export default create;
