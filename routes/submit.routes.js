import express from 'express';
import { createForm } from '../controllers/submit.controller.js';
import upload from '../utils/multer.js';
import { submitMovieController } from '../controllers/submit.controller.js';

const router = express.Router();

// On définit les noms des champs que Multer doit intercepter
const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'gallery', maxCount: 3 },
]);

router.post('/submit', uploadFields, submitMovieController);

router.post('/', createForm);

export default router;
