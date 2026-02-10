
import { Router } from "express"
import cors from "cors"
import { getAdminDashboard } from "../controllers/dashboard.controller.js"

const router = Router()

// Middlewares
router.use(cors())

/*
|--------------------------------------------------------------------------
| Dashboard Admin - GET /api/admin/dashboard
|--------------------------------------------------------------------------
*/
router.get("/", getAdminDashboard)


export default router
