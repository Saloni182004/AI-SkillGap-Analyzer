import Interview from "../model/interview.js";
import axios from "axios";

export const generateInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const authorization = req.headers.authorization;
    const { targetRole, totalQuestions = 10 } = req.body;
    const numPrevious = Math.round(totalQuestions * 0.4);
    const numRoadmap = Math.round(totalQuestions * 0.4);
    const numGeneral = totalQuestions - numPrevious - numRoadmap;
    let roadmap, userProfile;

    try {
      const roadmapResponse = await axios.get(`${process.env.ROADMAP_SERVICE_URL}/api/roadmap/getRoadmap`, {
        headers: { "x-user-id": userId, "Authorization": authorization }
      });
      roadmap = roadmapResponse.data;
      const profileResponse = await axios.get(`${process.env.ROADMAP_SERVICE_URL}/api/roadmap/getProfile`, {
        headers: { "x-user-id": userId, "Authorization": authorization }
      });
  
      userProfile = profileResponse.data.profile || profileResponse.data; 

    } catch (error) {
      console.error("Failed to fetch internal data:", error.message);
      return res.status(404).json({ 
        message: "Could not retrieve Roadmap or Profile data. Ensure the user has generated both." 
      });
    }

    const previousSkills = [
      ...(userProfile.core_skills || []), 
      ...(userProfile.tools_and_software || [])
    ];
    const roadmapSkills = [
      ...(roadmap.missingSkills || []), 
      ...(roadmap.userAddedSkills || [])
    ];

    const aiPayload = {
      targetRole,
      distribution: {
        previous: { count: numPrevious, skills: previousSkills },
        roadmap: { count: numRoadmap, skills: roadmapSkills },
        general: { count: numGeneral }
      }
    };
  
    const aiResponse = await axios.post(`${process.env.AI_ORCHESTRATOR_URL}/api/ai/generate-interview`, aiPayload, {
      headers: { "Authorization": authorization, "x-user-id": userId }
    });

    const newInterview = new Interview({
      userId,
      targetRole,
      questions: aiResponse.data.questions
    });

    await newInterview.save();

    return res.status(201).json({
      message: "Personalized interview generated!",
      interviewId: newInterview._id,
      questions: newInterview.questions
    });

  } catch (error) {
    console.error("Interview Generation Error:", error.message);
    return res.status(500).json({ message: "Failed to generate interview" });
  }
};

export const evaluateInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const authorization = req.headers.authorization;
    const { interviewId, userAnswers } = req.body;

    if (!interviewId || !userAnswers || !Array.isArray(userAnswers)) {
      return res.status(400).json({ message: "Invalid payload. interviewId and userAnswers array required." });
    }
    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found for this user." });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ message: "This interview has already been evaluated." });
    }

    let totalScore = 0;
    const maxScore = interview.questions.length * 10;
    
    const evaluationPromises = interview.questions.map(async (questionDoc) => {
      const submitted = userAnswers.find(ua => ua.questionId === questionDoc._id.toString());
      const answerText = submitted ? submitted.answer : "I don't know"; 

      try {
        const aiPayload = {
          question: questionDoc.question,
          expected_points: questionDoc.expectedAnswerPoints,
          user_answer: answerText
        };
        const aiResponse = await axios.post(
          `${process.env.AI_ORCHESTRATOR_URL}/api/ai/evaluate-answer`, 
          aiPayload, 
          { headers: { "Authorization": authorization, "x-user-id": userId } }
        );

        const { score, feedback, is_passing } = aiResponse.data;
        questionDoc.userAnswer = answerText;
        questionDoc.score = score;
        questionDoc.feedback = feedback; 
        
        totalScore += score;
      } catch (aiError) {
        console.error(`AI failed to grade question ${questionDoc._id}:`, aiError.message);
        questionDoc.userAnswer = answerText;
        questionDoc.score = 0;
        questionDoc.feedback = "System failed to evaluate this answer.";
      }
    });
    await Promise.all(evaluationPromises);
    interview.overallScore = Math.round((totalScore / maxScore) * 100);
    interview.status = "completed";
    
    await interview.save();

    return res.status(200).json({
      message: "Interview evaluated successfully!",
      overallScore: interview.overallScore,
      questions: interview.questions
    });

  } catch (error) {
    console.error("Interview Evaluation Error:", error.message);
    return res.status(500).json({ message: "Failed to evaluate interview" });
  }
};