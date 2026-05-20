import express from "express";
import {generateInterview, evaluateInterview } from "../controller/generateInterview.js";

const router = express.Router();

router.post("/generate-interview", generateInterview);
router.post("/evaluate-answer",evaluateInterview )


export default router;
