import express from 'express';
import * as MovieController from '../controllers/adminMovies.controller.js';

const router = express.Router();

router.get('/', MovieController.getMovies);
router.get('/:id', MovieController.getMovie);
router.post('/', MovieController.createMovie);
router.put('/:id', MovieController.updateMovie);
router.delete('/:id', MovieController.deleteMovie);

export default router;
