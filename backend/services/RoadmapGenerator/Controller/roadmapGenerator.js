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
      message: "Your 8-week career roadmap is ready!",
      roadmap: roadmap,
    });
  } catch (error) {
    console.error("Final Roadmap Generation Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "The AI Coach failed to generate the schedule. Please try again.",
    });
  }
};