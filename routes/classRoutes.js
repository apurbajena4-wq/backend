import express from "express";
import {
  startClass,
  endClass,
  getActiveClass,
} from "../controllers/classController.js";
import {protect,teacherOnly} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start",protect,teacherOnly, startClass);
router.post("/end",protect,teacherOnly, endClass);
router.get("/active/:subject",protect, getActiveClass);

export default router;