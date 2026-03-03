import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";
import DrillPage from "./components/DrillPage";
import HistoryPage from "./components/HistoryPage";
import MessageBox from "./components/MessageBox";
import { safeFetch } from "./utils/safeFetch";

import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// --- Drill Wrapper to handle dynamic drill fetching
function DrillWrapper({ drills, onNewAttempt }) {
  const { drillId } = useParams();
  const navigate = useNavigate();

  const drill = drills.find(d => d.drillId === Number(drillId));
  if (!drill) {
    return (
      <div className="p-8 text-red-600 font-semibold">
        Drill not found.
        <button
          onClick={() => navigate("/dashboard")}
          className="underline ml-2 text-blue-600"
        >
          Go back
        </button>
      </div>
    );
  }
  return (
    <DrillPage
      drillId={drill.drillId}
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
  const [, setLoadingDrills] = useState(false);

  // --- Check session
  useEffect(() => {
    const checkSession = async () => {
      const me = await safeFetch(`${API_URL}/auth/me`);
      setUser(me?.email ? me : null);
    };
    checkSession();
  }, []);

  // --- Load drills & history
  useEffect(() => {
    if (user) {
      const loadDrills = async () => {
        setLoadingDrills(true);
        const data = await safeFetch(`${API_URL}/drills`);
        if (data) setDrills(data);
        setLoadingDrills(false);
      };

      const loadHistory = async () => {
        const data = await safeFetch(`${API_URL}/attempts`);
        if (data) setHistory(data);
      };

      loadDrills();
      loadHistory();
    }
  }, [user]);

  const handleSignIn = () => window.location.href = `${API_URL}/auth/google`;

  const handleLogout = async (navigate) => {
    await safeFetch(`${API_URL}/auth/logout`);
    setUser(null);
    navigate("/");
  };

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage onSignIn={handleSignIn} />} />
        <Route path="/dashboard" element={user ? <DashboardPage drills={drills} user={user} /> : <Navigate to="/" />} />
        <Route path="/drills/:drillId" element={<DrillWrapper drills={drills} onNewAttempt={attempt => setHistory(prev => [attempt, ...prev])} />} />
        <Route path="/history" element={user ? <HistoryWrapper history={history} /> : <Navigate to="/" />} />
      </Routes>

      {message && <MessageBox message={message} onClose={() => setMessage("")} />}
    </Router>
  );
}

export default App;
