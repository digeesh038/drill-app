import { Router } from "express";
import { z } from "zod";
import { calculateScore } from "../utils/scoring.js";
import { requireAuth } from "../utils/auth.js";
import Attempt from "../models/Attempt.js";
import Drill from "../models/Drill.js";

const router = Router();

// Schema accepts both string/number for questionId
const attemptSchema = z.object({
  drillId: z.number(),
  answers: z.array(z.object({
    questionId: z.union([z.string(), z.number()]),
    answer: z.string()
  })),
});

// POST /api/attempts
router.post("/", requireAuth, async (req, res) => {
  const result = attemptSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: { code: 400, message: "Invalid request format" },
      details: result.error.errors,
    });
  }

  const { drillId, answers } = result.data;

  try {
    // 🔹 Find drill by numeric drillId
    const drill = await Drill.findOne({ drillId });

    if (!drill) {
      return res
        .status(404)
        .json({ error: { code: 404, message: "Drill not found" } });
    }

    // 🔹 Normalize answers so questionId is always string
    const normalizedAnswers = answers.map(a => ({
      questionId: String(a.questionId),
      answer: a.answer,
    }));

    // 🔹 Validate that all questionIds exist in the drill
    const isValid = normalizedAnswers.every(a =>
      drill.questions.some(q => q.id === a.questionId)
    );

    if (!isValid) {
      return res
        .status(400)
        .json({ error: { code: 400, message: "Invalid questionId in answers" } });
    }

    // 🔹 Score the attempt
    const score = calculateScore(normalizedAnswers, drill.questions);

    // 🔹 Save attempt
    const attempt = new Attempt({
      drillId,
      answers: normalizedAnswers,
      score,
      createdAt: new Date(),
      userId: req.user?._id?.toString() || "guest",
    });

    await attempt.save();

    res.json(attempt);
  } catch (err) {
    console.error("❌ Error saving attempt:", err);
    res.status(500).json({ error: "Failed to save attempt" });
  }
});

// GET /api/attempts
router.get("/", requireAuth, async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    const mongoAttempts = await Attempt.find({
      userId: req.user?._id?.toString() || "guest",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(mongoAttempts);
  } catch (err) {
    console.error("❌ Error fetching attempts:", err);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

export default router;
