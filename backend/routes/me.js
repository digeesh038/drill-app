import { Router } from "express";
import { requireAuth } from "../utils/auth.js";

const router = Router();

// Protected route
router.get("/", requireAuth, (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.username,
        email: req.user.email,
        googleId: req.user.googleId,
    });
});

export default router;
