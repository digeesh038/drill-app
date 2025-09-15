import { json } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

function applyMiddleware(app) {
  // Security headers
  app.use(helmet());

  // CORS (adjust frontend URL later)
  app.use(
    cors({
      origin: "http://localhost:5173", // replace in prod
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
        error: { code: 429, message: "Too many requests, please try again later." },
      },
    })
  );
}

export default applyMiddleware;
