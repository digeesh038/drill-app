import React, { useState } from "react";
import { safeFetch } from "../utils/safeFetch";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const data = await safeFetch(`${API_URL}/auth/admin-login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (data?.user) {
            onLoginSuccess(data.user);
            navigate("/admin");
        } else {
            setError("Invalid admin credentials or access denied.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 font-inter scale-in">
            <div className="card max-w-md w-full glass-morphism border-t-8 border-t-purple-600 shadow-2xl p-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-6">
                        <span className="text-white text-2xl">🛡️</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Admin Portal</h1>
                    <p className="text-slate-500 font-medium mt-2">Enter credentials to manage drills</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="flex flex-col space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Admin Email</label>
                        <input
                            type="email"
                            className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all font-bold text-slate-800"
                            placeholder="admin@drill.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                        <input
                            type="password"
                            className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all font-bold text-slate-800"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center animate-bounce">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl bg-purple-600 text-white text-xl font-black shadow-xl hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Verifying...' : 'Login to Dashboard'}
                    </button>
                </form>

                <button
                    onClick={() => navigate("/")}
                    className="mt-8 w-full text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
                >
                    ← Back to User Login
                </button>
            </div>
        </div>
    );
};

export default AdminLoginPage;
