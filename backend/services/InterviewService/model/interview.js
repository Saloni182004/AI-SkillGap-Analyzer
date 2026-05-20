import mongoose from "mongoose";

const InterviewQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["previous_skills", "roadmap_skills", "general_role"],
    required: true 
  },
  relatedSkill: { type: String }, 
  expectedAnswerPoints: [{ type: String }], 
  userAnswer: { type: String, default: "" },
  score: { type: Number, default: 0 } 
});

const InterviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetRole: { type: String, required: true },
  status: { type: String, enum: ["generated", "in_progress", "completed"], default: "generated" },
  questions: [InterviewQuestionSchema],
  overallScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Interview", InterviewSchema);