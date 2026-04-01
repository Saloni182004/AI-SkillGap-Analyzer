import express from "express";
import { analyzeGap,getMissingSkills, skillAddedByUser } from "../Controller/gapAnalyzer.js";

const router = express.Router();
router.post("/analyze", analyzeGap);
router.get("/missing-skills", getMissingSkills);
router.post("/add-missingskills", skillAddedByUser);

export default router;