import express from "express"
import { createServiceApp } from "../../shared/express/createServiceApp.js";
import { errorHandler } from "../../shared/utils/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";

const app = createServiceApp("auth-service");
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
