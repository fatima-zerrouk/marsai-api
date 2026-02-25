import create from '../models/rating.model.js';

const createRating = async (req, res) => {
  try {
    const { rate, movieId } = req.body;
    const userId = req.user.id;
    if (rate === undefined || movieId === undefined) {
      return res.status(400).json({ message: 'note ou id film manquant' });
    }
    const result = await create(rate, userId, movieId);
    res.status(201).json({
      message: 'Note enregistrée',
      ratingId: result.insertId,
    });
  } catch (error) {
    console.error('erreur SQL :', error.message);
    res.status(500).json({ message: 'erreur serveur' });
  }
};

export default createRating;
