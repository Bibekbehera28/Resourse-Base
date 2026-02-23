import serverless from "serverless-http";
import { createServer } from "./server-app";

const app = createServer();
export default serverless(app);

