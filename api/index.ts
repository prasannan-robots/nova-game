import serverless from "serverless-http";
import { app, initApp } from "../server/app";

// Ensure routes are registered before exporting the handler.
// Top-level await is used here; build environments that don't support it
// will transpile accordingly.
await initApp();

const handler = serverless(app as any);

export default handler;
