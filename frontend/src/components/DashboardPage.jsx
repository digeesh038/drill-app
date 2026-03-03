import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = ({ drills, user, history }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'hard': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isCompleted = (drillId) => {
    return (history || []).some(attempt => attempt.drillId === drillId);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in font-inter">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-16 space-y-8 md:space-y-0 text-center md:text-left">
        <div className="flex flex-col space-y-2">
          <h1 className="text-5xl font-black text-slate-900 font-outfit leading-tight tracking-tight">
            Hi, <span className="gradient-text">{user?.name?.split(' ')[0] || "User"}</span>! 👋
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            {isAdmin ? "Global oversight active. Monitoring all diagnostic systems." : "Which skill are we sharpening today?"}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="group px-8 py-4 bg-purple-600 rounded-2xl text-white font-black text-lg shadow-xl hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-3"
          >
            <span>🛡️ Admin Mode</span>
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">+</div>
          </button>
        )}
      </header>

      {/* DRILLS GRID */}
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest flex items-center space-x-3">
          <span className="w-10 h-1 bg-blue-600 rounded-full"></span>
          <span>{isAdmin ? "Master Drill Matrix" : "Available Drills"}</span>
        </h2>
        <span className="px-4 py-2 bg-slate-100 text-slate-500 font-bold rounded-xl text-sm border border-slate-200">
          {drills.length} Drills Found
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {drills.length > 0 ? (
          drills.map((drill) => {
            const completed = isCompleted(drill.drillId);
            const canAccess = !completed || isAdmin;

            return (
              <div
                key={drill.drillId}
                onClick={() => canAccess && navigate(`/drills/${drill.drillId}`)}
                className={`card transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${!canAccess
                    ? 'opacity-60 bg-slate-50 border-slate-100 cursor-not-allowed grayscale-[0.5]'
                    : 'hover-lift group cursor-pointer hover:border-blue-300'
                  }`}
              >
                {/* COMPLETED BANNER */}
                {completed && (
                  <div className="absolute top-0 right-0 p-2">
                    <span className="text-[10px] font-black bg-emerald-500 text-white px-3 py-1 rounded-bl-xl shadow-lg animate-fade-in uppercase">
                      {isAdmin ? "COMPLETED (Preview Enabled)" : "COMPLETED ✓"}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter border ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
                    </span>
                    {canAccess && (
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                      </div>
                    )}
                  </div>

                  <h3 className={`text-xl font-black mb-3 transition-colors font-outfit leading-snug ${completed && !isAdmin ? 'text-slate-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                    {drill.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {drill.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] font-black uppercase text-slate-300">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t ${completed && !isAdmin ? 'border-slate-100' : 'border-slate-50'}`}>
                  <span className="text-xs font-bold text-slate-400">
                    {drill.questions?.length || 0} Questions
                  </span>
                  <span className={`text-xs font-black px-4 py-2 rounded-xl transition-all ${completed && !isAdmin
                      ? 'text-emerald-500 bg-emerald-50 border border-emerald-100'
                      : 'text-blue-600 opacity-0 group-hover:opacity-100 bg-blue-50'
                    }`}>
                    {completed && !isAdmin ? 'PASSED' : isAdmin ? 'PREVIEW DRILL' : 'START NOW'}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center shadow-inner">
            <h3 className="text-2xl font-bold text-slate-400 mb-2 font-outfit uppercase">Matrix Empty</h3>
            <p className="text-slate-300 uppercase tracking-widest text-[10px] font-black">
              {isAdmin ? "Deployment Required: Construct and assign your first diagnostic drill." : "Awaiting administrator diagnostic deployment"}
            </p>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="mt-8 px-6 py-3 bg-purple-600 text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg text-xs"
              >
                + CONSTRUCT INITIAL DRILL
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
