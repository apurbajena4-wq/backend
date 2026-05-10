import Student from "../models/Student.js";
import Attendance from "../models/adminAttendance.js";

export const getAdminAttendanceAnalytics = async (req, res) => {
  try {

    const semester = Number(req.query.semester);

    const analytics = await Student.aggregate([

      {
        $match: { semester: semester }
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
+
      {
        $unwind: "$user"
      },

      {
        $lookup: {
          from: "attendances",
          localField: "_id",
          foreignField: "studentId",
          as: "attendance"
        }
      },

      {
        $addFields: {

          total: {
            $cond: [
              { $eq: [{ $size: "$attendance" }, 0] },
              50,   // default classes per paper
              { $size: "$attendance" }
            ]
          },

          present: {
            $size: {
              $filter: {
                input: "$attendance",
                as: "att",
                cond: { $eq: ["$$att.status", "Present"] }
              }
            }
          }

        }
      },

      {
        $addFields: {

          absent: {
            $subtract: ["$total", "$present"]
          },

          attendancePercentage: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$present", "$total"] },
                      100
                    ]
                  },
                  2
                ]
              }
            ]
          }

        }
      },

      {
        $project: {
          studentId: "$rollNo",
          studentName: "$user.name",
          subject: "Not Started",
          total: 1,
          present: 1,
          absent: 1,
          attendancePercentage: 1
        }
      }

    ]);

    res.json(analytics);

  } catch (error) {

    console.error("ADMIN ATTENDANCE ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};