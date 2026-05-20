import axios from "axios";
import Roadmap from "../model/roadmapModel.js";
import { serviceUrls } from "../../../shared/config/serviceConfig.js";
const AI_SERVICE_URL = serviceUrls["aiOrchestrator"]
export const roadmapGenerator = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const roadmap = await Roadmap.findOne({ userId });

    if (!roadmap || (roadmap.missingSkills.length === 0 && roadmap.userAddedSkills.length === 0)) {
      return res.status(400).json({
        message: "No skills found to generate a roadmap. Please analyze your gap first.",
      });
    }
    const totalSkillsToLearn = [
      ...new Set([...roadmap.missingSkills, ...roadmap.userAddedSkills])
    ];
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/ai/generate-roadmap-plan`,
      {
        skills: totalSkillsToLearn,
        targetRole: roadmap.targetRole,
      },
      {
        headers: { Authorization: req.headers.authorization },
        timeout: 120000 
      }
    );
    roadmap.weeklyPlan = aiResponse.data.milestones;
    roadmap.status = "generated";
    roadmap.updatedAt = new Date();
    await roadmap.save();

    return res.json({
      message: "Your 4-week career roadmap is ready!",
      roadmap: roadmap,
    });
  } catch (error) {
    console.error("Final Roadmap Generation Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "The AI Coach failed to generate the schedule. Please try again.",
    });
  }
};

export const toggleMilestone = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { week, completed } = req.body;

    const roadmap = await Roadmap.findOne({ userId });
    
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    const weekIndex = roadmap.weeklyPlan.findIndex(w => w.week === week);
    if (weekIndex === -1) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    roadmap.weeklyPlan[weekIndex].completed = completed;
    await roadmap.save();

    return res.json({ 
      message: "Milestone updated successfully", 
      roadmap 
    });
  } catch (error) {
    console.error("Toggle Milestone Error:", error.message);
    return res.status(500).json({ message: "Failed to update milestone" });
  }
};