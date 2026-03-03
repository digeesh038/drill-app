import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://drill-app.onrender.com"
        : "http://localhost:3001";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${BASE_URL}/api/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    email: profile.emails?.[0]?.value,
                });

                if (!user) {
                    user = await User.create({
                        email: profile.emails?.[0]?.value,
                        name: profile.displayName,
                        picture: profile.photos?.[0]?.value || "default.jpg",
                        providers: [
                            { provider: "google", providerId: profile.id },
                        ],
                    });
                }

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;