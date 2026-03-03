import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";
import AdminPage from "./components/AdminPage";
import AdminLoginPage from "./components/AdminLoginPage";
import DrillPage from "./components/DrillPage";
import HistoryPage from "./components/HistoryPage";
import MessageBox from "./components/MessageBox";
import { safeFetch } from "./utils/safeFetch";

import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// --- Drill Wrapper
function DrillWrapper({ drills, onNewAttempt }) {
  const { drillId } = useParams();
  const navigate = useNavigate();

  const drill = drills.find(d => String(d.drillId) === String(drillId));

  if (!drill) {
    return (
      <div className="p-20 text-center animate-fade-in font-inter">
        <h2 className="text-4xl font-black text-rose-600 mb-4 font-outfit">Drill Not Found</h2>
        <p className="text-xl text-slate-500 mb-8 font-medium">Wait, where did it go? Check the ID or return home.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  return (
    <DrillPage
      drillId={drill._id}
      drillIdNumeric={drill.drillId}
      drillName={drill.title}
      questions={drill.questions || []}
      onGoToDashboard={() => navigate("/dashboard")}
      onNewAttempt={onNewAttempt}
    />
  );
}

// --- History Wrapper
function HistoryWrapper({ history }) {
  const navigate = useNavigate();
  return <HistoryPage history={history} onGoToDashboard={() => navigate("/dashboard")} />;
}

// --- Main App
function App() {
  const [user, setUser] = useState(null);
  const [drills, setDrills] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Check session
  useEffect(() => {
    const checkSession = async () => {
      const me = await safeFetch(`${API_URL}/auth/me`);
      setUser(me?.email ? me : null);
      setLoading(false);
    };
    checkSession();
  }, []);

  // --- Load drills & history
  useEffect(() => {
    if (user) {
      const loadDrills = async () => {
        const data = await safeFetch(`${API_URL}/drills`);
        if (data) setDrills(data);
      };

      const loadHistory = async () => {
        const data = await safeFetch(`${API_URL}/attempts`);
        if (data) setHistory(data);
      };

      loadDrills();
      loadHistory();
    }
  }, [user]);

  const loginUrl = `${API_URL}/auth/google`;

  const handleLogout = async (navigate) => {
    await safeFetch(`${API_URL}/auth/logout`);
    setUser(null);
    navigate("/");
  };

  const handleDrillAdded = (newDrill) => {
    setDrills(prev => {
      const exists = prev.find(d => d.drillId === newDrill.drillId);
      if (exists) {
        return prev.map(d => d.drillId === newDrill.drillId ? newDrill : d);
      }
      return [newDrill, ...prev];
    });
  };

  const handleDrillDeleted = (drillId) => {
    setDrills(prev => prev.filter(d => d.drillId !== drillId));
    setHistory(prev => prev.filter(h => h.drillId !== drillId));
  };

  if (loading) return null; // Or a loader

  return (
    <div className="min-h-screen bg-slate-50 custom-scrollbar selection:bg-blue-200">
      <Router>
        {user && <Navbar user={user} onLogout={handleLogout} />}

        <div className="pb-20">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage user={user} onSignIn={loginUrl} />} />
            <Route path="/admin-login" element={user?.role === "admin" ? <Navigate to="/admin" /> : <AdminLoginPage onLoginSuccess={(u) => setUser(u)} />} />
            <Route path="/dashboard" element={user ? <DashboardPage drills={drills} user={user} history={history} /> : <Navigate to="/" />} />
            <Route path="/drills/:drillId" element={user ? <DrillWrapper drills={drills} onNewAttempt={attempt => {
              setHistory(prev => [attempt, ...prev]);
              // 🏆 Update user's score in UI by re-fetching session
              const refreshUser = async () => {
                const me = await safeFetch(`${API_URL}/auth/me`);
                if (me?.email) setUser(me);
              };
              refreshUser();
            }} /> : <Navigate to="/" />} />
            <Route path="/history" element={user ? <HistoryWrapper history={history} /> : <Navigate to="/" />} />
            <Route path="/admin" element={user?.role === "admin" ? <AdminPage onDrillAdded={handleDrillAdded} onDrillDeleted={handleDrillDeleted} /> : <Navigate to="/" />} />
          </Routes>
        </div>

        {message && <MessageBox message={message} onClose={() => setMessage("")} />}
      </Router>
    </div>
  );
}

export default App;
