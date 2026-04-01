import express from "express";
import {roadmapGenerator} from "../Controller/roadmapGenerator.js";

const router = express.Router();
router.post("/generate-roadmap", roadmapGenerator);

export default router;