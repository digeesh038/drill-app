import { Router } from "express";
import passport from "./passport.js";
import { requireAuth } from "../utils/auth.js";

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
                sameSite: "none",
                secure: true,
            });

            res.json({ message: "Logged out successfully" });
        });
    });
});

export default router;