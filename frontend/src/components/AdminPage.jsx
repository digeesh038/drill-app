import React, { useState, useEffect } from "react";
import { safeFetch } from "../utils/safeFetch";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = ({ onDrillAdded, onDrillDeleted }) => {
    // List of drills for Edit/Delete
    const [allDrills, setAllDrills] = useState([]);
    const [view, setView] = useState("list"); // "list" or "form"

    // Form state
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");
    const [tags, setTags] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [questions, setQuestions] = useState([
        { id: "q1", text: "", type: "mcq", options: ["", "", "", ""], correctAnswer: "", correctAnswers: [] }
    ]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchDrills();
    }, []);

    const fetchDrills = async () => {
        const data = await safeFetch(`${API_URL}/drills`);
        if (data && !data.error) setAllDrills(data);
    };

    const handleAddQuestion = () => {
        const nextId = `q${questions.length + 1}`;
        setQuestions([...questions, { id: nextId, text: "", type: "mcq", options: ["", "", "", ""], correctAnswer: "", correctAnswers: [] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQs = [...questions];
        newQs[index][field] = value;
        setQuestions(newQs);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQs = [...questions];
        const oldVal = newQs[qIndex].options[optIndex];
        newQs[qIndex].options[optIndex] = value;

        // If we edited the text that was marked as correct, sync the correctAnswer field
        if (newQs[qIndex].correctAnswer === oldVal && oldVal !== "") {
            newQs[qIndex].correctAnswer = value;
        }
        // Sync correctAnswers array for checkboxes
        if (newQs[qIndex].type === "checkbox") {
            newQs[qIndex].correctAnswers = newQs[qIndex].correctAnswers.map(ans => ans === oldVal ? value : ans);
        }

        setQuestions(newQs);
    };

    const toggleCheckboxAnswer = (qIdx, opt) => {
        const newQs = [...questions];
        const currentAnswers = newQs[qIdx].correctAnswers || [];
        if (currentAnswers.includes(opt)) {
            newQs[qIdx].correctAnswers = currentAnswers.filter(a => a !== opt);
        } else {
            newQs[qIdx].correctAnswers = [...currentAnswers, opt];
        }
        setQuestions(newQs);
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setDifficulty("Medium");
        setTags("");
        setAssignedTo("");
        setQuestions([{ id: "q1", text: "", type: "mcq", options: ["", "", "", ""], correctAnswer: "", correctAnswers: [] }]);
        setMessage(null);
    };

    const handleEdit = (drill) => {
        setEditingId(drill.drillId);
        setTitle(drill.title);
        setDescription(drill.description || "");
        setDifficulty(drill.difficulty);
        setTags(drill.tags?.join(", ") || "");
        setAssignedTo(drill.assignedTo?.join(", ") || "");
        setQuestions(drill.questions?.length > 0 ? drill.questions.map(q => ({
            ...q,
            correctAnswers: q.correctAnswers || (q.type === 'checkbox' ? [] : [])
        })) : [{ id: "q1", text: "", type: "mcq", options: ["", "", "", ""], correctAnswer: "", correctAnswers: [] }]);
        setView("form");
    };

    const handleDelete = async (drillId) => {
        if (!window.confirm("Are you sure you want to delete this drill?")) return;
        const res = await safeFetch(`${API_URL}/drills/${drillId}`, { method: "DELETE" });
        if (res && !res.error) {
            setAllDrills(allDrills.filter(d => d.drillId !== drillId));
            if (onDrillDeleted) onDrillDeleted(drillId);
            alert("Drill deleted successfully!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // EXTRA FRONTEND VALIDATION
        const incomplete = questions.some(q => {
            if (!q.text.trim()) return true;
            if (q.type === 'mcq' || q.type === 'fillup') return !q.correctAnswer.trim();
            if (q.type === 'checkbox') return !q.correctAnswers || q.correctAnswers.length === 0;
            return false;
        });

        if (incomplete) {
            setMessage({ type: "error", text: "Matrix Error: Ensure ALL questions have both text AND at least one correct answer selected." });
            setLoading(false);
            return;
        }

        const drillData = {
            title,
            description,
            difficulty,
            tags: tags.split(",").map(t => t.trim()).filter(t => t),
            assignedTo: assignedTo.split(",").map(e => e.trim()).filter(e => e),
            questions: questions.filter(q => q.text.trim() !== ""),
        };

        const result = await safeFetch(`${API_URL}/drills${editingId ? `/${editingId}` : ""}`, {
            method: editingId ? "PUT" : "POST",
            body: JSON.stringify(drillData),
        });

        if (result && !result.error) {
            setMessage({ type: "success", text: `Drill successfully ${editingId ? "updated" : "added"}! 🚀` });
            if (!editingId) resetForm();
            fetchDrills();
            if (onDrillAdded) onDrillAdded(result.drill || result);
        } else {
            setMessage({ type: "error", text: result?.error || "Operation failed. Check permissions. ❌" });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in font-inter">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 space-y-4 md:space-y-0 text-center md:text-left">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-purple-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
                        <span className="text-white text-2xl">🛡️</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 font-outfit uppercase tracking-tight">Admin Headquarters</h1>
                        <p className="text-slate-500 font-medium">Control center for expert content.</p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => { setView("list"); resetForm(); }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        📁 Drill Library
                    </button>
                    <button
                        onClick={() => { setView("form"); resetForm(); }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${view === 'form' && !editingId ? 'bg-purple-600 text-white shadow-xl scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        ✨ Create New
                    </button>
                </div>
            </div>

            {view === "list" ? (
                <div className="grid grid-cols-1 gap-6">
                    {allDrills.map(drill => (
                        <div key={drill.drillId} className="card glass-morphism flex items-center justify-between group hover:border-purple-200 transition-all">
                            <div className="flex items-center space-x-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                    {drill.drillId}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 font-outfit">{drill.title}</h3>
                                    <div className="flex items-center space-x-4 text-xs font-bold text-slate-400 mt-1">
                                        <span className="uppercase tracking-widest text-purple-600">{drill.difficulty}</span>
                                        <span>•</span>
                                        <span>{drill.questions?.length || 0} Questions</span>
                                        <span>•</span>
                                        <span className="text-emerald-600">{drill.assignedTo?.length || 0} Users Assigned</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleEdit(drill)}
                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    title="Edit Drill"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(drill.drillId)}
                                    className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                    title="Delete Drill"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                    {allDrills.length === 0 && (
                        <div className="py-20 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl">
                            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">Library is Empty</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card glass-morphism border-t-8 border-t-purple-600 shadow-2xl">
                    <h2 className="text-3xl font-black mb-10 text-slate-900 font-outfit uppercase">
                        {editingId ? "Edit Existing Drill" : "Construct New Drill"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* BASIC INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Drill Title</label>
                                <input
                                    type="text"
                                    className="px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-bold text-slate-800"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Difficulty Level</label>
                                <select
                                    className="px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-bold text-slate-800"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                            <textarea
                                className="px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-bold text-slate-800 h-24"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Tags (Comma Sep)</label>
                                <input
                                    type="text"
                                    className="px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-bold text-slate-800 font-mono"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="logic, react, algorithms"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Assign to Emails</label>
                                <input
                                    type="text"
                                    className="px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all font-bold text-slate-800 font-mono"
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    placeholder="user1@gmail.com, user2@gmail.com"
                                />
                            </div>
                        </div>

                        {/* QUESTIONS SECTION */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                                <h3 className="text-xl font-black text-slate-900 uppercase font-outfit tracking-wider">Question Matrix</h3>
                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="px-4 py-2 bg-purple-600 text-white font-black rounded-xl text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    + ADD QUESTION
                                </button>
                            </div>

                            {questions.map((q, qIdx) => (
                                <div key={qIdx} className="p-8 bg-slate-50/50 rounded-3xl border-2 border-slate-100 space-y-8 relative group/q">
                                    <div className="absolute top-4 right-4 text-xs font-black text-slate-300">#{qIdx + 1}</div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 flex flex-col space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Text</label>
                                            <input
                                                type="text"
                                                className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-600 transition-all font-bold"
                                                value={q.text}
                                                onChange={(e) => handleQuestionChange(qIdx, "text", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                            <select
                                                className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-600 transition-all font-bold"
                                                value={q.type}
                                                onChange={(e) => handleQuestionChange(qIdx, "type", e.target.value)}
                                            >
                                                <option value="mcq">🔘 MCQ</option>
                                                <option value="checkbox">☑️ Checkbox (Multi)</option>
                                                <option value="fillup">✏️ Fill-in-the-gap</option>
                                            </select>
                                        </div>
                                    </div>

                                    {(q.type === 'mcq' || q.type === 'checkbox') ? (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Options ({q.type === 'mcq' ? 'Select radio for correct answer' : 'Select checkboxes for correct answers'})
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-slate-200 focus-within:border-purple-600 transition-all">
                                                        {q.type === 'mcq' ? (
                                                            <input
                                                                type="radio"
                                                                name={`correct-${qIdx}`}
                                                                checked={q.correctAnswer === opt && opt !== ""}
                                                                onChange={() => handleQuestionChange(qIdx, "correctAnswer", opt)}
                                                            />
                                                        ) : (
                                                            <input
                                                                type="checkbox"
                                                                checked={q.correctAnswers?.includes(opt) && opt !== ""}
                                                                onChange={() => toggleCheckboxAnswer(qIdx, opt)}
                                                            />
                                                        )}
                                                        <input
                                                            type="text"
                                                            className="flex-1 text-sm font-bold bg-transparent outline-none"
                                                            placeholder={`Option ${oIdx + 1}`}
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answer</label>
                                            <input
                                                type="text"
                                                className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-600 transition-all font-bold"
                                                value={q.correctAnswer}
                                                onChange={(e) => handleQuestionChange(qIdx, "correctAnswer", e.target.value)}
                                                placeholder="Exact string to match..."
                                                required
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                                        className="text-xs font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest"
                                    >
                                        Remove Question
                                    </button>
                                </div>
                            ))}
                        </div>

                        {message && (
                            <div className={`p-6 rounded-2xl font-black text-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-rose-50 text-rose-700 border-2 border-rose-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-5 rounded-2xl bg-purple-600 text-white text-2xl font-black shadow-2xl hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all ${loading ? 'opacity-50 grayscale' : ''}`}
                            >
                                {loading ? 'DEPLOYING...' : editingId ? '💾 UPDATE DRILL' : '🚀 DEPLOY DRILL'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => { setView("list"); resetForm(); }}
                                    className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    CANCEL
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
