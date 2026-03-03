import express from 'express';
import {
  getMovieById,
  getAllMovies,
} from '../controllers/movies.controller.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);

export default router;
