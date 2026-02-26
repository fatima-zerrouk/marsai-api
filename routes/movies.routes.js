import express from 'express';
import {
  getMovieById,
  getAllMovies,
} from '../controllers/movies.controller.js';

const router = express.Router();

// L'URL sera : http://localhost:3001/api/movies/:id
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

export default router;
