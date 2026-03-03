import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./auth/passport.js";
import applyMiddleware from "./middleware/index.js";
import healthRouter from "./routes/health.js";
import drillsRouter from "./routes/drills.js";
import attemptsRouter from "./routes/attempts.js";
import meRouter from "./routes/me.js";
import authRouter from "./auth/auth.js";

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const app = express();

    // Required for Render (important for secure cookies)
    app.set("trust proxy", 1);

    // Apply middleware (helmet, cors, rateLimit, json)
    applyMiddleware(app);

    // Session setup
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,      // HTTPS required
        httpOnly: true,
        sameSite: "none"   // Required for cross-domain
      }
    }));

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use("/api/health", healthRouter);
    app.use("/api/drills", drillsRouter);
    app.use("/api/attempts", attemptsRouter);
    app.use("/api/auth", authRouter);

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(err =>
    console.error("❌ MongoDB connection error:", err)
  );