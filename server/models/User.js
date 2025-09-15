import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        picture: { type: String },
        providers: [
            {
                provider: { type: String, required: true },
                providerId: { type: String, required: true },
            },
        ],
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default model("User", userSchema);
