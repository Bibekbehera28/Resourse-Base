import { createServer } from "../server/index";

// Create a fresh Express app instance for the serverless function
const app = createServer();

// Vercel Node.js Serverless Functions expect a default export
// that is a (req, res) handler. An Express app is already such
// a handler, so we can export it directly.
export default app;

