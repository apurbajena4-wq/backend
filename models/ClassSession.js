import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema({

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  location: {
    latitude: Number,
    longitude: Number
  },

  radius: {
    type: Number,
    default: 20
  },

  wifiSSID: {
    type: String
  },

  startTime: {
    type: Date,
    default: Date.now
  },

  endTime: Date,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("ClassSession", classSessionSchema);