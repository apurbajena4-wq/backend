import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";

/* ================================
   Create Teacher
================================ */
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher"
    });

    const teacher = await Teacher.create({
      userId: user._id,
      department
    });

    res.status(201).json({
      message: "Teacher created successfully",
      teacher
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   Get All Teachers
================================ */
export const getTeachers = async (req, res) => {
  try {

    const teachers = await Teacher.find()
      .populate("userId", "name email");

    res.json(teachers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   Assign Subjects to Teacher
================================ */
export const assignSubjects = async (req, res) => {
  try {

    const { teacherId, subjects } = req.body;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.subjects = subjects;

    await teacher.save();

    res.json({ message: "Subjects assigned successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   Delete Teacher
================================ */
export const deleteTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await User.findByIdAndDelete(teacher.userId);
    await teacher.deleteOne();

    res.json({ message: "Teacher deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};