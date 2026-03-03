import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: (process.env.API_URL || "http://localhost:3001") + "/api/auth/google/callback",
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = await User.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        role: "user",
                        providers: [{ provider: "google", providerId: profile.id }]
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// 🔥 IMPORTANT
passport.serializeUser((user, done) => {
    done(null, user.id); // store Mongo _id
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);   // restore full user
    } catch (err) {
        done(err, null);
    }
});

export default passport;