import { json } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

function applyMiddleware(app) {
  // Security headers
  app.use(helmet());

  // ✅ Clean CORS (Production + Local)
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL,
      ],
      credentials: true,
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