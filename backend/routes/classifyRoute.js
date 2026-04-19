import express from "express";
import multer from "multer";
import { classifyEmergency } from "../controllers/classifyController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /classify:
 *   post:
 *     summary: Classify an emergency situation from text or audio
 *     description: Analyzes either the provided text or an uploaded audio file and classifies it into one of the known emergency categories.
 *     responses:
 *       200:
 *         description: Successful classification
 */
router.post("/", upload.single("audio"), classifyEmergency);

export default router;
