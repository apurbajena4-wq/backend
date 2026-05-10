import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminAttendanceRoutes from "./routes/adminAttendanceRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/TeacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin:"*"}));
app.use(express.json());

// app.get("/api",(req,res)=>{
//   res.json({
//     message:"Attendnce API is running"
//   });
// });

/* ROUTES */

import batchRoutes from "./routes/batchRoutes.js";

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/class", classRoutes);

app.use("/api/admin",adminAttendanceRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/batches", batchRoutes);


/* TEST API */

app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

app.get("/", (req, res) => {
  res.send("Backend is running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
