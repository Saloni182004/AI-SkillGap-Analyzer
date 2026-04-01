import "../../shared/config/loadEnv.js";
import { connectDB } from "../../shared/config/mongodb.js";
import app from "./app.js";
import { servicePorts } from "../../shared/config/serviceConfig.js";
connectDB();
app.listen(servicePorts.roadmap, () => {
  console.log(`Roadmap service is running on port ${servicePorts.roadmap}`);
});
