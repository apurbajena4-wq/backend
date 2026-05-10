import express from "express";
import { getDepartments, createDepartment, deleteDepartment } from "../controllers/departmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", protect, authorize("admin"), createDepartment);
router.delete("/:id", protect, authorize("admin"), deleteDepartment);

export default router;
