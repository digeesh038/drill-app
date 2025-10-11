import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
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

    // Parse JSON and URL-encoded bodies
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Apply any custom middleware
    applyMiddleware(app);

    // Enable CORS for React frontend with credentials
    app.use(cors({
      origin: "http://localhost:5173",
      credentials: "include"
    }));

    // SESSION + PASSPORT setup
    app.use(session({
      secret: process.env.SESSION_SECRET || "keyboard cat",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true} 
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use("/api/health", healthRouter);
    app.use("/api/drills", drillsRouter);
    app.use("/api/attempts", attemptsRouter);
    app.use("/api/me", meRouter);
    app.use("/api/auth", authRouter);

    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
