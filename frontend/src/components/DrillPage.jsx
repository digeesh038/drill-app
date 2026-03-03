import React, { useState } from "react";
import { safeFetch } from "../utils/safeFetch";

const API_URL = import.meta.env.VITE_API_URL;

const DrillPage = ({ drillId, drillIdNumeric, drillName, questions, onGoToDashboard, onNewAttempt }) => {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [results, setResults] = useState(null);

  const handleAnswerChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleCheckboxToggle = (qId, opt) => {
    const current = Array.isArray(answers[qId]) ? answers[qId] : [];
    if (current.includes(opt)) {
      setAnswers({ ...answers, [qId]: current.filter(val => val !== opt) });
    } else {
      setAnswers({ ...answers, [qId]: [...current, opt] });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Format answers for backend validation [{ questionId: string, answer: any }]
    const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      answer: ans
    }));

    const result = await safeFetch(`${API_URL}/attempts`, {
      method: "POST",
      body: JSON.stringify({ drillId: drillIdNumeric || drillId, answers: formattedAnswers }),
    });

    if (result && !result.error) {
      setResults(result);
      setSubmitted(true);
      if (onNewAttempt) onNewAttempt(result);
    }
    setSubmitting(false);
  };

  if (submitted && results) {
    const total = questions.length;
    const score = results.score;
    const percentage = Math.round((score / total) * 100);
    const isGreat = percentage >= 70;

    return (
      <div className="max-w-3xl mx-auto px-6 py-20 animate-fade-in font-inter">
        <div className="card glass-morphism border-t-8 border-t-emerald-500 shadow-2xl text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-inner border-4 border-emerald-500/20">
            <span className="text-4xl">🏆</span>
          </div>

          <h2 className="text-5xl font-black text-slate-900 mb-2 font-outfit uppercase tracking-tighter">
            Performance <span className="gradient-text">Complete</span>
          </h2>
          <p className="text-slate-500 font-bold mb-12 uppercase tracking-widest text-sm">Reviewing your expert diagnostics</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-16">
            <div className="p-8 bg-slate-50/50 rounded-3xl border-2 border-slate-100">
              <span className="text-5xl font-black text-slate-900">{score}</span>
              <span className="text-2xl font-black text-slate-300 ml-2">/ {total}</span>
              <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-widest">Correct Matrix</p>
            </div>
            <div className="p-8 bg-slate-50/50 rounded-3xl border-2 border-slate-100">
              <span className={`text-5xl font-black ${isGreat ? 'text-emerald-600' : 'text-rose-600'}`}>{percentage}%</span>
              <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-widest">Precision Level</p>
            </div>
          </div>

          <button
            onClick={onGoToDashboard}
            className="w-full py-5 rounded-2xl bg-slate-900 text-white text-xl font-black shadow-2xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentSlide + 1) / questions.length) * 100;
  const currentQ = questions[currentSlide];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in font-inter">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-slate-100 pb-8 space-y-4 md:space-y-0">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-black rounded-lg text-[10px] uppercase tracking-tighter shadow-sm border border-blue-200">
              Diagnostic Mode: Active
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 font-outfit tracking-tighter uppercase">{drillName}</h1>
        </div>
        <button
          onClick={onGoToDashboard}
          className="btn-secondary flex items-center space-x-2"
        >
          <span>🔚 Terminate Drill</span>
        </button>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-slate-400 tracking-widest uppercase">System Progress</span>
          <span className="text-xs font-black text-blue-600 tracking-widest font-mono">Q{currentSlide + 1} / {questions.length}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-100 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full shadow-lg"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="card glass-morphism border-t-8 border-t-blue-600 shadow-2xl mb-12 transition-all p-10 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-10">
          <div className="flex items-start space-x-8">
            <div className="w-14 h-14 bg-slate-900 flex-shrink-0 flex items-center justify-center rounded-2xl shadow-xl rotate-3">
              <span className="text-white text-xl font-black">Q{currentSlide + 1}</span>
            </div>
            <p className="text-3xl font-black text-slate-800 leading-snug font-inter tracking-tight">
              {currentQ?.text}
            </p>
          </div>

          <div className="relative group/input pt-4">
            {currentQ?.type === 'mcq' || currentQ?.type === 'checkbox' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options?.map((opt, idx) => {
                  const isSelected = currentQ.type === 'mcq'
                    ? answers[currentQ.id] === opt
                    : (answers[currentQ.id] || []).includes(opt);

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (currentQ.type === 'mcq') handleAnswerChange(currentQ.id, opt);
                        else handleCheckboxToggle(currentQ.id, opt);
                      }}
                      className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 font-bold text-lg flex items-center justify-between group/btn ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-105'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-400 hover:shadow-lg'
                        }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                        ? 'bg-white/20 border-white'
                        : 'bg-transparent border-slate-300 group-hover/btn:border-blue-400'
                        }`}>
                        {isSelected && <span className="text-white">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Provide your input:</label>
                <input
                  type="text"
                  className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-200 rounded-3xl focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all font-bold text-slate-800 text-2xl placeholder-slate-300 shadow-inner group-hover/input:bg-white"
                  placeholder="Type answer here..."
                  value={answers[currentQ?.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ?.id, e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center space-x-2">
          <span className="w-4 h-0.5 bg-slate-300 rounded-full"></span>
          <span>{currentQ?.type === 'checkbox' ? 'Multi-Response Select Enable' : 'Secure Response Input'}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className={`px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl flex items-center space-x-3 hover:bg-slate-200 transition-all ${currentSlide === 0 ? 'opacity-20 pointer-events-none' : ''}`}
        >
          <span>←</span>
          <span>Previous Step</span>
        </button>

        {currentSlide === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-12 py-5 bg-emerald-600 rounded-2xl text-white font-black text-xl shadow-2xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all outline-none"
          >
            {submitting ? 'VALIDATING...' : 'FINALIZE & GRADE 🏁'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentSlide(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-12 py-5 bg-blue-600 rounded-2xl text-white font-black text-xl shadow-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all outline-none"
          >
            Continue ➔
          </button>
        )}
      </div>
    </div>
  );
};

export default DrillPage;
