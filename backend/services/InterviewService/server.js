import "../../shared/config/loadEnv.js";
import app from "./app.js";
import { servicePorts } from "../../shared/config/serviceConfig.js";

app.listen(servicePorts.interview, () => {
  console.log(`interviewService is running on port ${servicePorts.interview}`);
});
