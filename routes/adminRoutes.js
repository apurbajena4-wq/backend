import express from "express";
import {
  createStudent,
  createTeacher,
  assignSubjects,
  getAllStudents,
  getAllTeachers,
  getAdminDashboardStats
} from "../controllers/adminController.js";

import { getLowAttendanceStudents } from "../controllers/attendanceController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   STUDENT MANAGEMENT
================================ */

// Create student (manual entry by admin)
router.post("/create-student", protect, adminOnly, createStudent);

// Get all students
router.get("/students", protect, adminOnly, getAllStudents);

/* ===============================
   TEACHER MANAGEMENT
================================ */

// Create teacher
router.post("/create-teacher", protect, adminOnly, createTeacher);

// Get all teachers
router.get("/teachers", protect, adminOnly, getAllTeachers);

// Assign subjects to teacher
router.post("/assign-subjects", protect, adminOnly, assignSubjects);

/* ===============================
   ATTENDANCE & REPORTS
================================ */

// Low attendance students (<75%)
router.get("/low-attendance", protect, adminOnly, getLowAttendanceStudents);

// Dashboard statistics
router.get("/dashboard-stats", protect, adminOnly, getAdminDashboardStats);

export default router;