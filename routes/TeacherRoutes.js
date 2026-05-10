import express from "express";
import {
  getTeachers,
  createTeacher,
  assignSubjects,
  deleteTeacher
} from "../controllers/TeacherController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getTeachers);
router.post("/", protect, adminOnly, createTeacher);
router.post("/assign-subjects", protect, adminOnly, assignSubjects);
router.delete("/:id", protect, adminOnly, deleteTeacher);

export default router;