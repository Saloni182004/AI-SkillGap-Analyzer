import cors from "cors";
import express from "express";

export function createServiceApp(serviceName) {
  const app = express();

  app.use(cors());

  app.get("/health", (req, res) => {
    res.json({
      service: serviceName,
      status: "ok",
    });
  });

  return app;
}
