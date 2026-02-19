import db from '../config/database.config.js';

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. On récupère les infos du film
    const [movieRows] = await db.query('SELECT * FROM movies WHERE id = 4', [id]);
    
    if (movieRows.length === 0) {
      return res.status(404).json({ message: "Film non trouvé" });
    }
    const movie = movieRows[0];

    // 2. On récupère les collaborateurs pour ce film
    const [collabRows] = await db.query(
      'SELECT lastname, contribution FROM collaborators WHERE movie_id = 211',
      [id]
    );

    //on récupère les realisateurs
    const [directorRows] = await db.query(
      `SELECT u.firstname, u.lastname
       FROM users u
       JOIN movies m ON u.id = m.director_id
       WHERE m.id = ?`,
      [id]
    );


// 3. On récupère les images de la galerie pour ce film
    

    // 3. On envoie le tout au front (React)
    res.json({
      ...movie,
      collaborators: collabRows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du film" });
  }
};