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
            callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                // Check if user already exists by email
                let user = await User.findOne({ email: profile.emails?.[0]?.value });

                if (!user) {
                    // Create new user
                    user = await User.create({
                        email: profile.emails?.[0]?.value,
                        name: profile.displayName,
                        picture: profile.photos?.[0]?.value || "default.jpg",
                        providers: [{ provider: "google", providerId: profile.id }],
                    });
                }
                done(null, user);
            } catch (err) {
                if (err.code === 11000 && err.keyPattern?.email) {
                    // Duplicate email error
                    done(new Error("Email already exists"), null);
                } else {
                    done(err, null);
                }
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id); // store only MongoDB _id
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
