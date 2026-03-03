import { Router } from "express";
import Drill from "../models/Drill.js"; // Mongo model
import Attempt from "../models/Attempt.js"; // History model
import { requireAdmin, requireAuth } from "../utils/auth.js";

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
router.get("/", requireAuth, async (req, res) => {
  try {
    const userRole = (req.user?.role || "user").toLowerCase();
    const userEmail = req.user?.email || "unknown";

    console.log(`🔍 Access Request: ${userEmail} | Role: ${userRole}`);

    // Admins bypass all filters and see everything. 
    // Users only see drills explicitly assigned to them.
    const filter = userRole === "admin" ? {} : { assignedTo: userEmail };

    console.log(`🛠️ SQL Filter Applied: ${JSON.stringify(filter)}`);

    const drills = await Drill.find(filter);
    console.log(`✅ Transmission Success: ${drills.length} drills dispatched.`);
    res.json(drills);
  } catch (err) {
    console.error("❌ Critical Retrieval Error:", err);
    res.status(500).json({ error: "Access Denied: Could not retrieve drill matrix." });
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

// ✅ POST a new drill (Admin Only)
router.post("/", requireAdmin, async (req, res) => {
  console.log("Creating drill with body:", JSON.stringify(req.body, null, 2));
  const { drillId, title, description, difficulty, tags, questions, assignedTo } = req.body;

  if (!title || !difficulty) {
    return res.status(400).json({ error: "Title and difficulty are required" });
  }

  try {
    const duplicate = await Drill.findOne({ title: new RegExp(`^${title}$`, "i") });
    if (duplicate) {
      return res.status(409).json({ error: "Drill with this title already exists" });
    }

    const newId = drillId ? Number(drillId) : await getNextDrillId();

    const drillDoc = new Drill({
      drillId: newId,
      title,
      description,
      difficulty,
      tags: tags || [],
      questions: questions || [],
      assignedTo: Array.isArray(assignedTo) ? assignedTo : (assignedTo ? [assignedTo] : []),
    });
    await drillDoc.save();

    res.status(201).json({ message: "Drill added", drillId: newId, drill: drillDoc });
  } catch (err) {
    console.error("MongoDB save error:", err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: `Validation Error: ${messages.join(", ")}` });
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate entry. Title or ID already exists." });
    }
    res.status(500).json({ error: "Failed to save drill. Internal server error." });
  }
});

// ✅ PUT (Update) a drill (Admin Only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedDrill = await Drill.findOneAndUpdate(
      { drillId: Number(id) },
      { $set: body },
      { new: true }
    );

    if (!updatedDrill) {
      return res.status(404).json({ error: "Drill not found" });
    }

    res.json({ message: "Drill updated", drill: updatedDrill });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update drill" });
  }
});

// ✅ DELETE a drill (Admin Only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const drillId = Number(req.params.id);

    // 1. Delete the drill
    const deletedDrill = await Drill.findOneAndDelete({ drillId });
    if (!deletedDrill) {
      return res.status(404).json({ error: "Drill not found" });
    }

    // 2. 🛡️ Deep Clean: Purge all associated history attempts
    const deleteStats = await Attempt.deleteMany({ drillId });
    console.log(`🧹 Cascaded Deletion: Purged ${deleteStats.deletedCount} history entries for Drill #${drillId}`);

    res.json({
      message: "Drill and associated history deleted successfully",
      purgedHistoryCount: deleteStats.deletedCount
    });
  } catch (err) {
    console.error("❌ Deep Clean Error:", err);
    res.status(500).json({ error: "Failed to purge drill and history matrix." });
  }
});

export default router;
