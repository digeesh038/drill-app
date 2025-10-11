import { Schema, model } from "mongoose";

// Sub-schema for questions
const questionSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    correctAnswer: { type: String, required: true }, 
});

// Main drill schema
const drillSchema = new Schema({
    drillId: { type: Number, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    difficulty: { type: String, required: true },
    tags: [String],
    questions: [questionSchema],
});

export default model("Drill", drillSchema);
