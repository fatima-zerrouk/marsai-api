import db from '../config/database.config.js';

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. On récupère les infos du film (Correction du "WHERE id = 4")
    const [movieRows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
    
    if (movieRows.length === 0) {
      return res.status(404).json({ message: "Film non trouvé" });
    }
    const movie = movieRows[0];

    // 2. On récupère les collaborateurs (Correction du "WHERE movie_id = 211")
    const [collabRows] = await db.query(
      'SELECT lastname, contribution FROM collaborators WHERE movie_id = ?',
      [id]
    );

    // // 3. On récupère le réalisateur (Nom + Prénom)
    // const [directorRows] = await db.query(
    //   `SELECT u.firstname, u.lastname
    //    FROM users u
    //    JOIN movies m ON u.id = m.director_id
    //    WHERE m.id = ?`,
    //   [id]
    // );

    // 3. On récupère le réalisateur (Nom + Prénom) depuis la table directors
const [directorRows] = await db.query(
  `SELECT d.firstname, d.lastname
   FROM directors d
   JOIN movies m ON d.id = m.director_id
   WHERE m.id = ?`,
  [id]
);



    // On prépare le nom complet du réalisateur
    const directorName = directorRows.length > 0 
      ? `${directorRows[0].firstname} ${directorRows[0].lastname}` 
      : "Réalisateur inconnu";

    // 4. On renvoie tout au front
    res.json({
      ...movie,
      collaborators: collabRows,
      director: directorName // ✅ On ajoute cette clé pour le Front
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}