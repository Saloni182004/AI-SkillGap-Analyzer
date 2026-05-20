import express from "express"
import { createServiceApp } from "../../shared/express/createServiceApp.js";
import { errorHandler } from "../../shared/utils/errorHandler.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import { connectDB } from "../../shared/config/mongodb.js";
const app = createServiceApp("interview-service");
app.use(express.json())
connectDB();


app.use("/api/interview",interviewRoutes );
app.use(errorHandler);

export default app;
