import express from "express";
import { getAdminAttendanceAnalytics } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/attendance-analytics", protect, adminOnly, getAdminAttendanceAnalytics);

export default router;