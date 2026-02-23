import express from 'express';
import { createForm } from '../controllers/submit.controller.js';

const router = express.Router();

// ✅ On retire "authenticate", la route est maintenant libre
router.post('/', createForm);

export default router;
