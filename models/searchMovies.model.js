const db = require('../config/database.config');

const searchMovies = (keyword, callback) => {
  const sql = 'SELECT * FROM movies WHERE name LIKE ?';
  db.query(sql, [`%${keyword}$`], callback);
};

module.exports = {
  searchMovies,
};
