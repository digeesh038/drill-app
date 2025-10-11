// server/routes/auth.js
import express from "express";
import passport from "passport";

const router = express.Router();

router.post("/login", passport.authenticate("google", { session: true }), (req, res) => {
    // req.user is now set and session cookie is created
    res.json({ message: "Logged in successfully", user: req.user });
});

export default router;
