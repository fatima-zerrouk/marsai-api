import express from 'express';
import * as MovieController from '../controllers/adminMoviesResult.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

// GET /api/admin/movies -> tous les films avec score
router.get(
  '/',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.getMovies
);

// GET /api/admin/movies/:id -> film par id
router.get(
  '/:id',
  authenticate,
  authorizeRoles('Admin'),
  MovieController.getMovie
);

export default router;
