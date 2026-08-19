export const servicePorts = {
  gateway: Number(process.env.GATEWAY_PORT || 5000),
  auth: Number(process.env.AUTH_SERVICE_PORT || 5001),
  resume: Number(process.env.RESUME_SERVICE_PORT || 5002),
  aiOrchestrator: Number(process.env.AI_ORCHESTRATOR_SERVICE_PORT || 5003),
  roadmap: Number(process.env.ROADMAP_SERVICE_PORT || 5004),
  interview: Number(process.env.INTERVIEW_SERVICE_PORT || 5005),
};

export const serviceUrls = {
  gateway: process.env.GATEWAY_URL || `http://localhost:${servicePorts.gateway}`,
  auth: process.env.AUTH_SERVICE_URL || `http://localhost:${servicePorts.auth}`,
  resume: process.env.RESUME_SERVICE_URL || `http://localhost:${servicePorts.resume}`,
  aiOrchestrator: process.env.AI_ORCHESTRATOR_URL || `http://localhost:${servicePorts.aiOrchestrator}`,
  roadmap: process.env.ROADMAP_SERVICE_URL || `http://localhost:${servicePorts.roadmap}`,
  interview: process.env.INTERVIEW_SERVICE_URL || `http://localhost:${servicePorts.interview}`
};