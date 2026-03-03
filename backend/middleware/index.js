import { json } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

function applyMiddleware(app) {
  // Security headers (MINIMAL to keep headers under limit)
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
    dnsPrefetchControl: false,
    frameguard: false,
    hidePoweredBy: true,
    hsts: false, // Disable HSTS to save header space
    ieNoOpen: false,
    noSniff: false,
    referrerPolicy: false,
    xssFilter: false
  }));

  // ✅ CORS optimized for cross-domain sessions
  app.use(
    cors({
      origin: "https://drill-app.vercel.app", // Use explicit URL to save space
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400
    })
  );

  // Parse JSON
  app.use(json());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: {
        error: {
          code: 429,
          message: "Too many requests, please try again later.",
        },
      },
    })
  );
}

export default applyMiddleware;