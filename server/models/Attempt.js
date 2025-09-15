import mongoose, { Schema, model } from "mongoose";

const attemptSchema = new mongoose.Schema({
    drillId: { type: Number, required: true },
    answers: [{ questionId: String, answer: String }],
    score: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String, required: true }
});

export default model("Attempt", attemptSchema);
