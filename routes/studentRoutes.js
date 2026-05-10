import express from "express";
import { getStudents, addStudent, getStudentById, deleteStudent, promoteStudents, getPassedStudents, getStudentsByBatch, getStudentsBySemester } from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "teacher"), getStudents);
router.post("/", protect, authorize("admin"), addStudent);

// New Routes
router.post("/promote", protect, authorize("admin"), promoteStudents);
router.get("/passed", protect, authorize("admin", "teacher"), getPassedStudents);
router.get("/batch/:batchId", protect, authorize("admin", "teacher"), getStudentsByBatch);
router.get("/semester/:semester", protect, authorize("admin", "teacher"), getStudentsBySemester);

router.get("/:id", protect, authorize("admin", "teacher", "student"), getStudentById);
router.delete("/:id", protect, authorize("admin"), deleteStudent);

export default router;
