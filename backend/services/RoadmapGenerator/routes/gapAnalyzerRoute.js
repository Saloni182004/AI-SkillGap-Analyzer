import express from "express";
import { analyzeGap,getMissingSkills, skillAddedByUser, getRoadmap, getUserProfile } from "../Controller/gapAnalyzer.js";

const router = express.Router();
router.post("/analyze", analyzeGap);
router.get("/missing-skills", getMissingSkills);
router.post("/add-missingskills", skillAddedByUser);
router.get("/getRoadmap", getRoadmap);
router.get("/getProfile", getUserProfile);

export default router;