import express from "express";
import {
  createBatch,
  getAllBatches,
  updateBatch,
  deleteBatch
} from "../controllers/batchController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createBatch);
router.get("/", protect, adminOnly, getAllBatches);
router.put("/:id", protect, adminOnly, updateBatch);
router.delete("/:id", protect, adminOnly, deleteBatch);

export default router;
