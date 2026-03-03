import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        picture: { type: String },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        password: { type: String }, // For local admin login
        providers: [
            {
                provider: { type: String, required: true },
                providerId: { type: String, required: true },
            },
        ],
        totalScore: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default model("User", userSchema);
