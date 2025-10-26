import { createServer } from "http";
import { app, initApp } from "./app";
import { setupVite, serveStatic, log } from "./vite";

// Entrypoint for running a long-lived Node server (local development
// or when deploying the bundled server). This file creates an HTTP
// server and starts listening. The Express `app` itself is defined in
// `server/app.ts` so it can be imported by serverless functions without
// immediately starting a listener.

(async () => {
  await initApp();

  // create the HTTP server around the configured express app
  const server = createServer(app);

  // only setup vite in development (adds middleware and HMR)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // in production the server would serve static files from dist/public
    // when running as a long-lived Node process. For serverless usage do
    // not call serveStatic here — Vercel will serve the built static files.
    try {
      serveStatic(app);
    } catch (e) {
      // serveStatic will throw if dist isn't present; display a friendly
      // message and continue so that local dev flows aren't blocked.
      log("serveStatic skipped: " + (e as Error).message);
    }
  }

  // prefer the platform-provided PORT (e.g. Vercel ignore, used for local)
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
