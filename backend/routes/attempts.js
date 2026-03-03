import { Router } from "express";
import { z } from "zod";
import { calculateScore } from "../utils/scoring.js";
import { requireAuth } from "../utils/auth.js";
import Attempt from "../models/Attempt.js";
import Drill from "../models/Drill.js";
import User from "../models/User.js";

const router = Router();

// Schema accepts any answer type (string or array)
const attemptSchema = z.object({
  drillId: z.number(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.any()
  })),
});

// ✅ POST /api/attempts (Submit a drill)
router.post("/", requireAuth, async (req, res) => {
  const parseResult = attemptSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request format. Ensure drillId and answers array are present.",
      details: parseResult.error.errors,
    });
  }

  const { drillId, answers } = parseResult.data;
  const userId = req.user._id.toString();

  try {
    // 🛡️ Guard: Check if user already completed this drill
    const existing = await Attempt.findOne({ drillId, userId });
    if (existing) {
      return res.status(403).json({ error: "Attempt Blocked: You have already completed this diagnostic session." });
    }

    // 🔹 Find drill
    const drill = await Drill.findOne({ drillId });
    if (!drill) {
      return res.status(404).json({ error: "Matrix Error: Drill target not found in database." });
    }

    // 🔹 Score the attempt
    const score = calculateScore(answers, drill.questions);

    // 🔹 Save attempt with detailed info for history
    const attempt = new Attempt({
      drillId,
      drillTitle: drill.title,
      answers,
      score,
      totalQuestions: drill.questions.length,
      createdAt: new Date(),
      userId,
      userName: req.user.name || "Unknown User",
      userEmail: req.user.email
    });

    await attempt.save();

    // 🏆 Accumulate score on User document
    if (score > 0) {
      await User.findByIdAndUpdate(userId, { $inc: { totalScore: score } });
      console.log(`🏆 User ${req.user.email} earned +${score} points. New total recorded.`);
    }

    res.json(attempt);
  } catch (err) {
    console.error("❌ Error saving attempt:", err);
    res.status(500).json({ error: "Failed to save attempt. Server error." });
  }
});

// ✅ GET /api/attempts (Fetch history)
router.get("/", requireAuth, async (req, res) => {
  try {
    // 👁️ Admin sees EVERYTHING, regular users only see their own
    const filter = req.user.role === "admin" ? {} : { userId: req.user._id.toString() };

    console.log(`📜 Fetching history for user: ${req.user.email} (Role: ${req.user.role})`);

    const history = await Attempt.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(history);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
