import express from 'express';
import { getMovieById } from '../controllers/movie.controller.js';

const router = express.Router();

// L'URL sera : http://localhost:3001/api/movies/:id
router.get('/:id', getMovieById);

export default router;