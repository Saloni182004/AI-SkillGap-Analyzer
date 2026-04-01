import axios from "axios";
import Resume from "../model/Resume.js";
import Roadmap from "../model/roadmapModel.js";
import { serviceUrls } from "../../../shared/config/serviceConfig.js";

const AI_SERVICE_URL = serviceUrls["aiOrchestrator"]

export const analyzeGap = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const userId = req.headers["x-user-id"];
    const resume = await Resume.findOne({ user_id: userId });

    if (!resume || !resume.profile) {
      return res.status(404).json({
        message: "Resume profile not found. Please upload your resume first.",
      });
    }
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/ai/find-gaps`,
      {
        profile: resume.profile, 
        targetRole: targetRole,
      },
      {
        headers: {
          Authorization: req.headers.authorization, 
        },
        timeout: 60000 
      }
    );

    const { missing_skills } = aiResponse.data;
    const roadmap = await Roadmap.findOneAndUpdate(
      { userId },
      {
        userId,
        targetRole,
        missingSkills: missing_skills,
        status: "customizing",
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.json({
        message: "Gap analysis complete!",
        roadmap
    });

  } catch (error) {
    console.error("Analyze Gap Error:", error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.detail || "Failed to analyze skill gap";

    return res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const getMissingSkills = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const roadmap = await Roadmap.findOne({ userId });

    if (!roadmap) {
      return res.status(404).json({
        success:false,
        message: "No missing skills found. Please start by analyzing your skill gap.",
      });
    }
    const allSkills = [...roadmap.missingSkills, ...roadmap.userAddedSkills];

    return res.json({
      success:true,
      message: "missing skills retrieved successfully",
      missingSkills:allSkills
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success:false,
      message: "Failed to fetch missing skills",
    });
  }
};

export const skillAddedByUser = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { skillName } = req.body;

    if (!skillName || skillName.trim() === "") {
      return res.status(400).json({succes:false, message: "Skill name is required" });
    }
    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { userId },
      { 
        $addToSet: { userAddedSkills: skillName.trim() },
        $set: { updatedAt: new Date() }
      },
      { new: true } 
    ).select("missingSkills userAddedSkills");
    if (!updatedRoadmap) {
      return res.status(404).json({
        message: "Roadmap not found. Analyze your gap first before adding custom skills.",
      });
    }
    const combinedSkills = [
      ...updatedRoadmap.missingSkills, 
      ...updatedRoadmap.userAddedSkills
    ];
    return res.json({
      success:true,
      message: `Skill '${skillName}' added to your goals!`,
      allMissingSkills: combinedSkills
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success:false,
      message: "Failed to add custom skill",
    });
  }
};