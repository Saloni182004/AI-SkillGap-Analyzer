import { createServiceApp } from "../shared/express/createServiceApp.js";
import { createProxyMiddleware } from "./proxy/createProxyMiddleware.js";
import { verifyToken } from "../shared/middleware/authMiddleware.js";

const app = createServiceApp("api-gateway", {parseJson: false});

app.get("/", (req, res) => {
  res.json({
    service: "api-gateway",
    message: "AI Skill Analyzer microservices gateway",
  });
});

app.use("/api/auth", createProxyMiddleware("auth"));
app.use("/api/resumes", verifyToken, createProxyMiddleware("resume"));
app.use("/api/ai", verifyToken, createProxyMiddleware("aiOrchestrator"));
app.use("/api/roadmap", verifyToken, createProxyMiddleware("roadmap"));

export default app;
