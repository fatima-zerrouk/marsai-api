import express from 'express';
import { getMovieById, getAllMovies } from '../controllers/movie.controller.js';
import { submitMovieController } from '../controllers/movie.controller.js';
import upload from '../utils/multer.js';
const router = express.Router();

// L'URL sera : http://localhost:3001/api/movies/:id
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// L'URL sera : http://localhost:3001/api/movies/submit
router.post(
  '/submit', // Changé de "/" à "/submit" pour correspondre à ton Frontend
  upload.fields([
    { name: 'thumbnail', maxCount: 1 }, // Changé "image" en "thumbnail"
    { name: 'gallery', maxCount: 3 }, // Ajouté "gallery" (max 3 photos)
    { name: 'video', maxCount: 1 },
  ]),
  submitMovieController
);

export default router;
