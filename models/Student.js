import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  rollNo: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },

  department: {
    type: String,
    required: true,
    trim: true
  },

  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },

  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    // Not required initially to prevent breaking existing data
  },

  section: {
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: ["active", "passed"],
    default: "active"
  }
},
{ timestamps: true }
);

export default mongoose.model("Student", studentSchema);