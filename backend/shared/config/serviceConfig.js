export const servicePorts = {
  gateway: Number(process.env.GATEWAY_PORT),
  auth: Number(process.env.AUTH_SERVICE_PORT),
  resume: Number(process.env.RESUME_SERVICE_PORT),
  aiOrchestrator:Number(process.env.AI_ORCHESTRATOR_SERVICE_PORT),
  roadmap: Number(process.env.ROADMAP_SERVICE_PORT),
};

export const serviceUrls = {
  gateway:`http://localhost:${servicePorts.gateway}`,
  auth:`http://localhost:${servicePorts.auth}`,
  resume:`http://localhost:${servicePorts.resume}`,
  aiOrchestrator:`http://localhost:${servicePorts.aiOrchestrator}`,
  roadmap:`http://localhost:${servicePorts.roadmap}`
};
