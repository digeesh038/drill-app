import mongoose, { Schema, model } from "mongoose";

const attemptSchema = new mongoose.Schema({
    drillId: { type: Number, required: true },
    drillTitle: { type: String }, // Store for quick lookup
    answers: [{
        questionId: String,
        answer: Schema.Types.Mixed // Support string or array (for checkboxes)
    }],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    userName: { type: String },
    userEmail: { type: String }
});

export default model("Attempt", attemptSchema);
