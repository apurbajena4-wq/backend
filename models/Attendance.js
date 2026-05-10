import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  semester: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true
  },

  // location: {
  //   latitude: Number,
  //   longitude: Number
  // },

  gpsVerified:{
      type: Boolean,
      default: false
  },

  wifiSSID:{
      type: String
  },

  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);