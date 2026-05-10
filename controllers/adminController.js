import User from "../models/User.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";

/* =====================================================
   1️⃣ CREATE STUDENT
===================================================== */
export const createStudent = async (req, res) => {
  try {

    const { name, email, rollNo, department, semester, batch, section } = req.body;

    if (!name || !email || !rollNo || !department || !batch) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const rollExists = await Student.findOne({ rollNo });
    if (rollExists) {
      return res.status(400).json({ message: "Roll number already exists" });
    }

    let user = await User.findOne({ email });

    if (user) {
      const existingStudent = await Student.findOne({ userId: user._id });
      if (existingStudent) {
        return res.status(400).json({ message: "Student record already exists for this email" });
      }
      
      if (user.role !== "student") {
        user.role = "student";
        await user.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash("student123", 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "student"
      });
    }

    const student = await Student.create({
      userId: user._id,
      rollNo,
      department,
      semester: semester || 1, // Default to 1
      batch,
      section,
      status: "active"
    });

    res.status(201).json({
      message: "Student created successfully",
      student
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =====================================================
   2️⃣ CREATE TEACHER
===================================================== */
export const createTeacher = async (req, res) => {

  try {

    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      const existingTeacher = await Teacher.findOne({ userId: user._id });
      if (existingTeacher) {
        return res.status(400).json({ message: "Teacher record already exists for this email" });
      }
      
      if (user.role !== "teacher") {
        user.role = "teacher";
        await user.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash("teacher123", 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "teacher"
      });
    }

    const teacher = await Teacher.create({
      userId: user._id,
      department,
      subjects: []
    });

    res.status(201).json({
      message: "Teacher created successfully",
      teacher
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* =====================================================
   3️⃣ ASSIGN SUBJECTS TO TEACHER
===================================================== */

export const assignSubjects = async (req, res) => {

  try {

    const { teacherId, subjects } = req.body;

    if (!teacherId || !subjects) {
      return res.status(400).json({ message: "Teacher and subjects required" });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { subjects },
      { new: true }
    ).populate("userId", "name email");

    res.json({
      message: "Subjects assigned successfully",
      teacher
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* =====================================================
   4️⃣ GET ALL STUDENTS
===================================================== */

export const getAllStudents = async (req, res) => {

  try {

    const students = await Student.find()
      .populate("userId", "name email role")
      .populate("batch")
      .sort({ rollNo: 1 });

    res.json(students);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* =====================================================
   5️⃣ GET ALL TEACHERS
===================================================== */

export const getAllTeachers = async (req, res) => {

  try {

    const teachers = await Teacher.find()
      .populate("userId", "name email role");

    res.json(teachers);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* =====================================================
   6️⃣ ADMIN ATTENDANCE ANALYTICS
   (PER SUBJECT / PAPER)
===================================================== */

export const getAdminAttendanceAnalytics = async (req, res) => {

  try {

    const semester = Number(req.query.semester);
    const batchId = req.query.batchId;

    if (!semester || Number.isNaN(semester)) {
      return res.status(400).json({ message: "Semester is required" });
    }

    // Fetch subjects dynamically based on the semester to match records properly
    const subjects = await Attendance.distinct("subject", { semester });

    let studentQuery = { semester };
    if (batchId && batchId !== "All") {
      studentQuery.batch = batchId;
    }

    const students = await Student.find(studentQuery)
      .populate("userId", "name")
      .populate("batch");

    let result = [];

    for (const student of students) {

      // Skip students with null userId to avoid crashes
      if (!student.userId) continue;

      for (const subject of subjects) {

        const attendanceRecords = await Attendance.find({
          studentId: student.userId._id,
          subject,
          semester
        });

        const present = attendanceRecords.filter(
          a => a.status === "Present"
        ).length;

        const total = 50; // 50 classes per paper
        const absent = total - present;

        const percentage =
          total === 0 ? 0 : ((present / total) * 100).toFixed(2);

        result.push({
          studentId: student.rollNo,
          studentName: student.userId.name,
          subject,
          total,
          present,
          absent,
          attendancePercentage: Number(percentage)
        });

      }

    }

    res.json(result);

  } catch (error) {

    console.error("ADMIN ANALYTICS ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

};


/* =====================================================
   7️⃣ ADMIN DASHBOARD STATS
===================================================== */

export const getAdminDashboardStats = async (req, res) => {

  try {

    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    res.json({
      totalStudents,
      totalTeachers
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

}; 
