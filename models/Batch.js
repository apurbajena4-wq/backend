import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    admissionYear: {
      type: Number,
      required: true,
    },
    passingYear: {
      type: Number,
      required: true,
    },
    batchCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
