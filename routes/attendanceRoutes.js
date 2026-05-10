import express from "express";

import {
  markAttendance,
  manualAttendance,
  getStudentAttendance,
  getAttendanceReport,
  getAttendanceSummary,
  getAdminAttendanceAnalytics,
  getLowAttendanceStudents
} from "../controllers/attendanceController.js";

import {
  protect,
  adminOnly,
  teacherOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
========================================
1️⃣ STUDENT + GPS AUTO ATTENDANCE
========================================
*/

// Student marks attendance automatically (GPS + WiFi verification)
router.post("/mark", protect, markAttendance);

router.post("/manual",protect,teacherOnly,manualAttendance);

/*
========================================
2️⃣ STUDENT ROUTES
========================================
*/

// Student views attendance records
router.get("/student/:studentId", protect, getStudentAttendance);

// Student attendance percentage
router.get("/summary/:studentId", protect, getAttendanceSummary);


/*
========================================
3️⃣ TEACHER ROUTES
========================================
*/

// Teacher can see attendance reports
router.get("/report", protect, teacherOnly, getAttendanceReport);


/*
========================================
4️⃣ ADMIN ROUTES
========================================
*/

// Admin analytics
router.get("/analytics", protect, adminOnly, getAdminAttendanceAnalytics);

// Students with low attendance (<75%)
router.get("/low-attendance", protect, adminOnly, getLowAttendanceStudents);

export default router;