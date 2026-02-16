import * as MovieModel from '../models/adminMoviesResult.model.js';

/**
 * Récupérer tous les films
 */
export const getMovies = async (req, res) => {
  try {
    const movies = await MovieModel.getAllMovies();

    console.log(movies);

    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    console.error('GET_MOVIES_ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des films',
    });
  }
};

/**
 * Récupérer un film par ID
 */
export const getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movieId = Number(id);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID de film invalide',
      });
    }

    const movie = await MovieModel.getMovieById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé',
      });
    }

    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error('GET_MOVIE_ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du film',
    });
  }
};
