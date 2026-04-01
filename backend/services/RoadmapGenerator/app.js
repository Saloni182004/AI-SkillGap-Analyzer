import express from "express"
import { createServiceApp } from "../../shared/express/createServiceApp.js";
import gapAnalyzeRoute from "./routes/gapAnalyzerRoute.js";
import roadmapGeneratorRoute  from "./routes/roadmapGeneratorRoute.js";
import { errorHandler } from "../../shared/utils/errorHandler.js";

const app = createServiceApp("roadmap-service");
app.use(express.json())

app.use("/api/roadmap", gapAnalyzeRoute );
app.use("/api/roadmap", roadmapGeneratorRoute);
app.use(errorHandler);

export default app;