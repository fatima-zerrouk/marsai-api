import db from '../config/database.config.js';

 const create = (rate, userId, movieId, callback) => {
    const sql = "INSERT INTO ratings (rate, user_id, movie-id) VALUES (?, ?, ?)";
    db.query(sql, [rate, userId, movieId], callback);
};

export default create;