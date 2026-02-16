import express from 'express';
import * as MovieController from '../controllers/adminMoviesResult.controller.js';

const router = express.Router();

// GET /api/admin/movies -> tous les films avec score
router.get('/', MovieController.getMovies);

// GET /api/admin/movies/:id -> film par id
router.get('/:id', MovieController.getMovie);

export default router;
