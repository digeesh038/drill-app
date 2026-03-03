import { json } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

function applyMiddleware(app) {
  // Security headers
  app.use(helmet());

  // CORS (Production + Local support)
  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          "http://localhost:5173",
          process.env.FRONTEND_URL
        ];

        // allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
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