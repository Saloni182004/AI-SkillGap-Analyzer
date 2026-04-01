import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  targetRole: { type: String, required: true },
  missingSkills: [{ type: String }],
  userAddedSkills: [{ type: String }],
  weeklyPlan: [
    {
      week: String,
      topic: String, 
      learning_goals: [String], 
      recommended_resources: [String], 
    },
  ],
  status: {
    type: String,
    enum: ["analyzing", "customizing", "generated"],
    default: "analyzing",
  },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Roadmap", RoadmapSchema);