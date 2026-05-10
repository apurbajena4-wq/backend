import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  department: {
    type: String,
    required: true
  },

  subjects: [
    {
      type: String
    }
  ]

},
{ timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);