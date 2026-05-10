import Students from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import ClassSession from "../models/ClassSession.js";

/*
========================================
0️⃣ LOW ATTENDANCE STUDENTS (<75%)
(Admin)
========================================
*/
export const getLowAttendanceStudents = async (req, res) => {
  try {

    const Students = await Attendance.aggregate([
      {
        $group: {
          _id: "$studentId",
          totalClasses: { $sum: 1 },
          presentClasses: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          totalClasses: 1,
          presentClasses: 1,
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$presentClasses", "$totalClasses"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $match: { attendancePercentage: { $lt: 75 } }
      }
    ]);

    res.status(200).json(students);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/*
========================================
1️⃣ MARK ATTENDANCE
(Teacher / Student)
========================================
*/
export const markAttendance = async (req, res) => {

  try {

    const {
      studentId,
      subject,
      semester,
      status
    } = req.body;

    //PREVENT DUPLICATE ATTENDANCE
    const existing = await Attendance.findOne({
  studentId,
  subject,
  createdAt: {
    $gte: new Date().setHours(0,0,0,0)
  }
});

if(existing){
  return res.status(400).json({
    message:"Attendance already marked"
  });
}

    /* FIND ACTIVE CLASS */

    const session = await ClassSession.findOne({
      subject,
      isActive: true
    });

    if (!session) {
      return res.status(400).json({
        message: "No active class session"
      });
    }

    /* SAVE ATTENDANCE */

    const attendance = await Attendance.create({

      studentId,
      subject,
      semester,
      status,

      markedBy: req.user?._id

    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {

    res.status(500).json({
      message: "Error marking attendance",
      error: error.message
    });

  }

};



/*
========================================
2️⃣ GET STUDENT ATTENDANCE
(Student / Admin)
========================================
*/
export const getStudentAttendance = async (req, res) => {

  try {

    const { studentId } = req.params;

    const attendance = await Attendance.find({ studentId })
      .populate("markedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(attendance);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching attendance",
      error: error.message
    });

  }

};



/*
========================================
3️⃣ FULL ATTENDANCE REPORT
(Admin)
========================================
*/
export const getAttendanceReport = async (req, res) => {

  try {

    const report = await Attendance.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .populate("markedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(report);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching report",
      error: error.message
    });

  }

};



/*
========================================
4️⃣ STUDENT ATTENDANCE SUMMARY
========================================
*/
export const getAttendanceSummary = async (req, res) => {

  try {

    const { studentId } = req.params;

    const totalClasses = await Attendance.countDocuments({ studentId });

    const presentClasses = await Attendance.countDocuments({
      studentId,
      status: "Present"
    });

    const absentClasses = totalClasses - presentClasses;

    const percentage =
      totalClasses === 0
        ? 0
        : ((presentClasses / totalClasses) * 100).toFixed(2);

    res.status(200).json({
      totalClasses,
      presentClasses,
      absentClasses,
      attendancePercentage: Number(percentage)
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/*
========================================
5️⃣ ADMIN ATTENDANCE ANALYTICS
========================================
*/
export const getAdminAttendanceAnalytics = async (req, res) => {

  try {

    const { semester } = req.query;
    const pipeline = [];

    if (semester) {
      pipeline.push({ $match: { semester: Number(semester) } });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "userId",
          as: "studentInfo"
        }
      },
      {
        $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: { studentId: "$studentId", subject: "$subject" },
          studentName: { $first: "$user.name" },
          rollNo: { $first: "$studentInfo.rollNo" },
          totalClasses: { $sum: 1 },

          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
            }
          },

          absent: {
            $sum: {
              $cond: [{ $eq: ["$status", "Absent"] }, 1, 0]
            }
          }

        }
      },
      {
        $project: {
          _id: 0,
          studentId: "$rollNo",
          studentName: 1,
          subject: "$_id.subject",
          total: "$totalClasses",
          present: 1,
          absent: 1,

          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$present", "$totalClasses"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { studentId: 1, subject: 1 } }
    );

    const analytics = await Attendance.aggregate(pipeline);

    res.status(200).json(analytics);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/*
========================================
6️⃣ MANUAL ATTENDANCE (TEACHER)
========================================
*/

export const manualAttendance = async (req, res) => {

  try {

    const { studentId, subject, semester, status, date } = req.body;

    const recordDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(recordDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(recordDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOneAndUpdate(
      {
        studentId,
        subject,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      },
      {
        $set: {
          semester,
          status,
          markedBy: req.user._id,
        },
        $setOnInsert: {
          createdAt: recordDate
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: "Manual attendance marked",
      attendance
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};