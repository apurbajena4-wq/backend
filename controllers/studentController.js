import User from "../models/User.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";


/*
========================================
GET ALL STUDENTS
GET /api/students
Admin, Teacher
========================================
*/
export const getStudents = async (req, res) => {
  try {

    const students = await Student
      .find({})
      .sort({ rollNo: 1 }) // Correct sorting
      .populate("userId", "-password");

    res.status(200).json(students);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/*
========================================
ADD STUDENT
POST /api/students
Admin
========================================
*/
export const addStudent = async (req, res) => {

  try {

    const { name, email, password, rollNo, department, semester, batch, section } = req.body;

    if (!name || !email || !password || !rollNo || !department || !batch) {

      return res.status(400).json({
        message: "All fields are required"
      });

    }

    // Check duplicate roll number
    const rollExists = await Student.findOne({ rollNo });

    if (rollExists) {

      return res.status(400).json({
        message: "Roll number already exists"
      });

    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      await Student.findOneAndDelete({ userId: existingUser._id });
      await User.findByIdAndDelete(existingUser._id);

    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student"
    });

    // Create student profile
    const studentProfile = await Student.create({
      userId: user._id,
      rollNo: Number(rollNo),
      department,
      semester: semester || 1,
      batch,
      section,
      status: "active"
    });

    res.status(201).json({
      message: "Student added successfully",
      studentProfile
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};


/*
========================================
GET STUDENT BY ID
GET /api/students/:id
========================================
*/
export const getStudentById = async (req, res) => {

  try {

    const student = await Student
      .findById(req.params.id)
      .populate("userId", "-password");

    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      });

    }

    res.json(student);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


/*
========================================
DELETE STUDENT
DELETE /api/students/:id
Admin
========================================
*/
export const deleteStudent = async (req, res) => {

  try {

    const student = await Student.findById(req.params.id);

    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      });

    }

    await User.findByIdAndDelete(student.userId);
    await student.deleteOne();

    res.json({
      message: "Student removed successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/*
========================================
PROMOTE STUDENTS
POST /api/students/promote
Admin
========================================
*/
export const promoteStudents = async (req, res) => {
  try {
    const activeStudents = await Student.find({ status: "active" });
    let promotedCount = 0;
    let passedCount = 0;

    for (const student of activeStudents) {
      if (student.semester < 6) {
        student.semester += 1;
        promotedCount++;
      } else {
        student.status = "passed";
        passedCount++;
      }
      await student.save();
    }

    res.json({
      message: "Promotion successful",
      promotedCount,
      passedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================================
GET PASSED STUDENTS
GET /api/students/passed
========================================
*/
export const getPassedStudents = async (req, res) => {
  try {
    const passedStudents = await Student.find({ status: "passed" })
      .populate("userId", "-password")
      .populate("batch");
    res.json(passedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================================
GET STUDENTS BY BATCH
GET /api/students/batch/:batchId
========================================
*/
export const getStudentsByBatch = async (req, res) => {
  try {
    const students = await Student.find({ batch: req.params.batchId })
      .populate("userId", "-password")
      .populate("batch");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================================
GET STUDENTS BY SEMESTER
GET /api/students/semester/:semester
========================================
*/
export const getStudentsBySemester = async (req, res) => {
  try {
    const students = await Student.find({ semester: Number(req.params.semester) })
      .populate("userId", "-password")
      .populate("batch");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};