import { Router } from "express";
import Drill from "../models/Drill.js"; // Mongo model

const router = Router();

// Simple in-memory cache
let cachedDrills = null;
let cacheTime = null;

// Helper: get next numeric drillId
const getNextDrillId = async () => {
  const lastDrill = await Drill.findOne().sort({ drillId: -1 });
  return lastDrill ? lastDrill.drillId + 1 : 1;
};

// ✅ GET all drills
router.get("/", async (req, res) => {
  try {
    const now = Date.now();

    // Return cache if valid
    if (cachedDrills && cacheTime && now - cacheTime < 60000) {
      return res.json(cachedDrills);
    }

    const drills = await Drill.find();
    cachedDrills = drills;
    cacheTime = now;

    res.json(drills);
  } catch (err) {
    console.error("Error fetching drills:", err);
    res.status(500).json({ error: "Failed to fetch drills" });
  }
});

// ✅ GET drill by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const drill = await Drill.findOne({ drillId: Number(id) });

    if (!drill) {
      return res.status(404).json({ error: "Drill not found" });
    }

    res.json(drill);
  } catch (err) {
    console.error("Error fetching drill:", err);
    res.status(500).json({ error: "Failed to fetch drill" });
  }
});

// ✅ POST a new drill
router.post("/", async (req, res) => {
  const { drillId, title, difficulty, tags, questions } = req.body;

  if (!title || !difficulty) {
    return res.status(400).json({ error: "Title and difficulty are required" });
  }

  try {
    // Duplicate check
    const duplicate = await Drill.findOne({ title: new RegExp(`^${title}$`, "i") });
    if (duplicate) {
      return res.status(409).json({ error: "Drill with this title already exists" });
    }

    // Auto-generate numeric ID if not provided
    const newId = drillId ? Number(drillId) : await getNextDrillId();

    // Format questions properly (array of objects with id + text)
    const formattedQuestions = Array.isArray(questions)
      ? questions.map((q, index) =>
          typeof q === "string" ? { id: `q${index + 1}`, text: q } : q
        )
      : [];

    // Store in MongoDB
    const drillDoc = new Drill({
      drillId: newId,
      title,
      difficulty,
      tags: tags || [],
      questions: formattedQuestions,
    });
    await drillDoc.save();

    // Invalidate cache
    cachedDrills = null;
    cacheTime = null;

    res.status(201).json({ message: "Drill added", drillId: newId });
  } catch (err) {
    console.error("MongoDB save error:", err);
    res.status(500).json({ error: "Failed to save drill" });
  }
});

export default router;
