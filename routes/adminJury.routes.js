

import { Router } from "express";
import { AdminJuryController } from "../controllers/adminJury.controller.js";
import cors from "cors";

const router = Router();

router.use(cors());

router.get("/", AdminJuryController.getAllJury);
router.delete("/:id", AdminJuryController.deleteJury);
router.put("/:id", AdminJuryController.updateJury);
router.post("/", AdminJuryController.createJury);

export default router;
