import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
========================
PROTECT ROUTE
========================
*/

export const protect = async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    try {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await User.findById(decoded.id)
        .select("-password");

      next();

    } catch (error) {

      res.status(401).json({
        message: "Not authorized"
      });

    }

  } else {

    res.status(401).json({
      message: "No token"
    });

  }

};



/*
========================
AUTHORIZE ROLE
========================
*/

export const authorize = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    next();

  };

};



/*
========================
ADMIN ONLY
========================
*/

export const adminOnly = (req, res, next) => {

  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Admin only"
    });
  }

};



/*
========================
TEACHER ONLY
========================
*/

export const teacherOnly = (req, res, next) => {

  if (req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({
      message: "Teacher only"
    });
  }

};



/*
========================
STUDENT ONLY
========================
*/

export const studentOnly = (req, res, next) => {

  if (req.user.role === "student") {
    next();
  } else {
    res.status(403).json({
      message: "Student only"
    });
  }

};