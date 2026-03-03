import { Schema, model } from "mongoose";

// Sub-schema for questions
const questionSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ["mcq", "fillup", "checkbox"], default: "fillup" },
    options: [String], // For MCQ and Checkbox
    correctAnswer: { type: String }, // Primary/Single answer
    correctAnswers: [String], // Array for multi-select (checkbox)
});

// Main drill schema
const drillSchema = new Schema({
    drillId: { type: Number, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    tags: [String],
    questions: [questionSchema],
    assignedTo: [String], // Emails of users who can see this drill
});

export default model("Drill", drillSchema);
