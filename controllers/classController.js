import ClassSession from "../models/ClassSession.js";

/*
========================================
1️⃣ START CLASS
(Teacher)
========================================
*/
export const startClass = async (req, res) => {
  try {
    
    console.log("USER:", req.user);
    const { subject } = req.body;

    // Validation
    if (!subject) {
      return res.status(400).json({
        message: "Subject is required"
      });
    }

    //End any existing active class of this teacher 
    await ClassSession.updateMany({
      teacherId: req.user._id,isActive:true},
    {
      isActive: false,
      endTime: new Date()
    });

    // Create session
    const session = await ClassSession.create({
      teacherId: req.user._id,
      subject,
      startTime: new Date(),
      isActive: true
    });

    res.status(201).json({
      message: "Class started successfully",
      session
    });

  } catch (error) {
    res.status(500).json({
      message: "Error starting class",
      error: error.message
    });
  }
};


/*
========================================
2️⃣ END CLASS
(Teacher)
========================================
*/
export const endClass = async (req, res) => {

  try {

    const { subject } = req.body;

    const session = await ClassSession.findOneAndUpdate(
      { subject,  teacherId: req.user._id, isActive: true },
      {
        isActive: false,
        endTime: new Date()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        message: "No active class found"
      });
    }

    res.json({
      message: "Class ended successfully",
      session
    });

  } catch (error) {

    res.status(500).json({
      message: "Error ending class",
      error: error.message
    });

  }

};


/*
========================================
3️⃣ GET ACTIVE CLASS
(Student)
========================================
*/
export const getActiveClass = async (req, res) => {

  try {

    const { subject } = req.params;

    const session = await ClassSession.findOne({
      subject,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        message: "No active class"
      });
    }

    res.status(200).json(session);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching active class",
      error: error.message
    });

  }

};