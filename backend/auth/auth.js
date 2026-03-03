import { Router } from "express";
import passport from "./passport.js";
import { requireAuth } from "../utils/auth.js";
import User from "../models/User.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Google Login
|--------------------------------------------------------------------------
*/

// Start Google OAuth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    })
);

// Google OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: process.env.FRONTEND_URL,
        session: true,
    }),
    (req, res) => {
        // Successful login
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
);

/*
|--------------------------------------------------------------------------
| Admin Login (Email/Password)
|--------------------------------------------------------------------------
*/

router.post("/admin-login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, role: "admin" });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        // Manually establish session
        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: "Login failed" });
            res.json({ message: "Admin logged in", user: { name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

router.get("/me", requireAuth, (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not logged in" });
        }

        res.json({
            id: req.user._id?.toString(),
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            totalScore: req.user.totalScore || 0,
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.clearCookie("connect.sid", {
                path: "/",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
            });

            res.json({ message: "Logged out successfully" });
        });
    });
});

export default router;