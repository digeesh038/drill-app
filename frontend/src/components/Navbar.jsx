import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 px-4 md:px-12 py-4 glass-morphism">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* LOGO */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="w-10 h-10 gradient-bg flex items-center justify-center rounded-xl shadow-lg group-hover:rotate-6 transition-transform">
                        <span className="text-white text-xl font-bold">D</span>
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-800 font-outfit">
                        DRILL<span className="text-blue-600 italic">APP</span>
                    </span>
                </Link>

                {/* LINKS */}
                <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                    <Link
                        to="/dashboard"
                        className="px-6 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-white transition-all duration-200"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/history"
                        className="px-6 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-white transition-all duration-200"
                    >
                        History
                    </Link>
                    {user?.role === "admin" && (
                        <Link
                            to="/admin"
                            className="px-6 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-purple-600 hover:bg-white transition-all duration-200"
                        >
                            Admin Controls
                        </Link>
                    )}
                </div>

                {/* USER PROFILE & LOGOUT */}
                <div className="flex items-center space-x-6">
                    {/* TOTAL SCORE BADGE */}
                    <div className="hidden lg:flex flex-col items-center bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-2xl shadow-sm">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">TOTAL PRECISION</span>
                        <span className="text-lg font-black text-slate-900 leading-tight">{user.totalScore || 0}</span>
                    </div>

                    <div className="hidden sm:flex flex-col items-end pr-2 border-r border-slate-200">
                        <span className="text-sm font-bold text-slate-900 leading-none">{user.name}</span>
                        <span className="text-xs text-slate-500 font-medium lowercase">
                            {user.role === 'admin' ? '🛡️ Administrator' : '🎓 Candidate'}
                        </span>
                    </div>
                    <button
                        onClick={() => onLogout(navigate)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg active:scale-95"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
