import React from "react";
import { useNavigate } from "react-router-dom";

const HistoryPage = ({ history, onGoToDashboard, user }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in font-inter">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 space-y-4 md:space-y-0 text-center md:text-left">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center shadow-2xl rotate-6 border-b-4 border-b-slate-300">
            <span className="text-3xl">📜</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 font-outfit uppercase tracking-tighter">
              {isAdmin ? "Global Intelligence" : "Your Journey"}
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
              {isAdmin ? "Monitoring all diagnostic performance" : "Reviewing every step of your progress"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all text-sm flex items-center space-x-3"
        >
          <span>🏠</span>
          <span>Return Home</span>
        </button>
      </div>

      {/* HISTORY LIST */}
      <div className="grid grid-cols-1 gap-6">
        {(history || []).map((attempt, idx) => {
          const score = attempt.score || 0;
          const total = attempt.totalQuestions || 0;
          const percent = total > 0 ? Math.round((score / total) * 100) : 0;
          const dateStr = new Date(attempt.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <div key={attempt._id || idx} className="card glass-morphism flex flex-col md:flex-row items-center justify-between p-8 group hover:border-blue-200 transition-all cursor-default">
              <div className="flex items-center space-x-6 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border-2 ${percent >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                  {percent}%
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 font-outfit uppercase">{attempt.drillTitle || `Drill #${attempt.drillId}`}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400 mt-1">
                    <span className="text-blue-500 uppercase tracking-widest">{dateStr}</span>
                    {isAdmin && (
                      <>
                        <span>•</span>
                        <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{attempt.userEmail}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{score} / {total} Correct</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 flex items-center space-x-4 w-full md:w-auto">
                <div className="hidden lg:block text-right">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Status</p>
                  <span className={`text-xs font-black uppercase tracking-widest ${percent >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {percent >= 70 ? 'PROFICIENT' : 'DIAGNOSTIC FAILED'}
                  </span>
                </div>
                <div className="w-1.5 h-10 bg-slate-100 rounded-full hidden md:block"></div>
                <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest">
                  VERIFIED
                </div>
              </div>
            </div>
          );
        })}

        {(history || []).length === 0 && (
          <div className="py-32 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] shadow-inner">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <span className="text-4xl">🌫️</span>
            </div>
            <p className="text-slate-400 font-black text-xl uppercase tracking-tighter">History Log Empty</p>
            <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Awaiting first diagnostic signal...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
