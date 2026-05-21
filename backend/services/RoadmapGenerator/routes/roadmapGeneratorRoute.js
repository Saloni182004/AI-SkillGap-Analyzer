import express from "express";
import {roadmapGenerator, toggleMilestone} from "../Controller/roadmapGenerator.js";

const router = express.Router();
router.post("/generate-roadmap", roadmapGenerator);
router.put("/toggle-milestone", toggleMilestone);

export default router;