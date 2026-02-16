import * as MovieModel from '../models/adminMovies.model.js';

export const getMovies = async (req, res) => {
  try {
    const movies = await MovieModel.getAllMovies();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de récupérer les films' });
  }
};

export const getMovie = async (req, res) => {
  try {
    const movie = await MovieModel.getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film introuvable' });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createMovie = async (req, res) => {
  try {
    const newMovie = await MovieModel.createMovie(req.body);
    res.status(201).json(newMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de créer le film' });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await MovieModel.updateMovie(req.params.id, req.body);
    res.json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de mettre à jour le film' });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const deleted = await MovieModel.deleteMovie(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Film introuvable' });
    res.json({ message: 'Film supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de supprimer le film' });
  }
};
