import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  departmentCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  subjects: [{
    type: String, // Or ref to a Subject model if we want to be more complex, but string is fine for now
    trim: true
  }],
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Link to a Teacher/Admin
  }
}, { timestamps: true });

export default mongoose.model("Department", departmentSchema);
