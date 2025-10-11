import { Router } from "express";
import passport from "./passport.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();

// Start Google OAuth login
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login",
        successRedirect: "http://localhost:5173/dashboard", // frontend
    })
);

// Get current logged-in user
router.get("/me", requireAuth, (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not logged in" });
        }

        res.json({
            id: req.user._id?.toString(),
            name: req.user.name,
            email: req.user.email,
            googleId: req.user.googleId,
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Logout
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });

        // Destroy session on server and clear cookie in browser
        req.session.destroy(() => {
            res.clearCookie("connect.sid", { path: "/" });
            res.json({ message: "Logged out successfully" });
        });
    });
});

export default router;
