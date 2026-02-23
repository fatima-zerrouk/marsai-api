const Movies = require('../models/searchMovies.model');

const search = (req, res) => {
  const keyword = req.query.q;

  Movies.searchMovies(keyword, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
};
y;
module.exports = {
  search,
};
