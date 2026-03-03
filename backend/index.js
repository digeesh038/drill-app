import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./auth/passport.js";
import User from "./models/User.js";
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

    // 🔥 Seed Admin User
    const seedAdmin = async () => {
      try {
        // Find by email and ensure role is 'admin' (Self-healing seed)
        let admin = await User.findOne({ email: "admin@drill.com" });
        if (!admin) {
          await User.create({
            email: "admin@drill.com",
            name: "Primary Admin",
            role: "admin",
            password: "admin123"
          });
          console.log("🛡️ Admin user seeded");
        } else if (admin.role !== "admin") {
          admin.role = "admin";
          await admin.save();
          console.log("🛡️ Admin role restored for primary account");
        }
      } catch (err) {
        console.error("❌ Admin seeding failed:", err);
      }
    };
    seedAdmin();

    const app = express();

    // Required for Render (important for secure cookies)
    app.set("trust proxy", 1);

    // Apply middleware (helmet, cors, rateLimit, json)
    applyMiddleware(app);

    app.use(session({
      name: "drill_sid", // Custom name to avoid header conflicts
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        secure: true, // Required for Brave/Chrome SameSite: none
        httpOnly: true,
        sameSite: "none", // Critical for Cross-Domain Cookies (Vercel to Render)
        maxAge: 24 * 60 * 60 * 1000
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