import Batch from "../models/Batch.js";

// Create a new batch
export const createBatch = async (req, res) => {
  try {
    const { course, academicYear, admissionYear, passingYear } = req.body;

    if (!course || !academicYear || !admissionYear || !passingYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBatch = await Batch.findOne({ academicYear });
    if (existingBatch) {
      return res.status(400).json({ message: "Batch for this academic year already exists" });
    }

    // Auto-generate batch code e.g. BCA2326
    const batchCode = `${course.replace(/\s+/g, "").toUpperCase()}${admissionYear.toString().slice(-2)}${passingYear.toString().slice(-2)}`;

    const batch = await Batch.create({
      course,
      academicYear,
      admissionYear,
      passingYear,
      batchCode,
    });

    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all batches
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ admissionYear: -1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a batch
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, academicYear, admissionYear, passingYear } = req.body;

    let updateData = { course, academicYear, admissionYear, passingYear };

    if (course && admissionYear && passingYear) {
       updateData.batchCode = `${course.replace(/\s+/g, "").toUpperCase()}${admissionYear.toString().slice(-2)}${passingYear.toString().slice(-2)}`;
    }

    const batch = await Batch.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({ message: "Batch updated successfully", batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a batch
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByIdAndDelete(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
