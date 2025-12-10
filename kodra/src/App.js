import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Onboarding from "./components/Onboarding";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Chat from "./components/Chat";
import Dashboard from "./components/Dashboard";
import Missions from "./components/Missions";
// Removed Legacy Imports

import LandingPage from "./components/LandingPage";
import LanguageSelector from "./components/LanguageSelector";
import "./i18n";
import "./global.css";

function App() {
  const [page, setPage] = useState("landing");
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("ka_dark")) ?? false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("ka_user")) || null);
  const [profileData, setProfileData] = useState(() => JSON.parse(localStorage.getItem("ka_profile")) || null);
  const [toasts, setToasts] = useState([]);

  const showToast = (msg, type = 'info', ttl = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ttl);
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("ka_dark", JSON.stringify(darkMode));
  }, [darkMode]);

  // Lightweight global customEvent navigation bridge
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.page) {
        setPage(e.detail.page);
      }
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  useEffect(() => {
    // Check for GitHub OAuth code
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && user) {
      // Avoid double processing
      if (window.githubProcessing) return;
      window.githubProcessing = true;

      // Clear code from URL immediately to prevent re-trigger
      window.history.replaceState({}, document.title, window.location.pathname);

      showToast("Linking GitHub account...", "info");

      // Call backend to exchange code
      import("./services/api").then(({ default: api }) => {
        api.linkGitHub(user.id, code)
          .then(res => {
            showToast("GitHub Connected Successfully!", "success");
            // Update profile with new connection status
            saveProfile({ ...profileData, githubProfile: res.data });
          })
          .catch(err => {
            console.error("GitHub Link Error:", err);
            showToast("Failed to link GitHub: " + err.message, "error");
          })
          .finally(() => {
            window.githubProcessing = false;
          });
      });
    }
  }, [user]); // Depends on user being logged in

  const handleLogin = (u) => {
    console.log("✅ User logged in:", u);
    setUser(u);
    localStorage.setItem("ka_user", JSON.stringify(u));
    // Requirement: after login always go to profile page
    setPage("dashboard"); // Changed from profile to dashboard
    showToast(`Welcome back ${u.name || ''}`, 'success');
  };

  const handleRegister = (u) => {
    console.log("✅ User registered:", u);
    setUser(u);
    localStorage.setItem("ka_user", JSON.stringify(u));
    // Requirement: after sign up go to onboarding page
    setPage("onboarding");
    showToast('Registration successful. Please complete onboarding.', 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setProfileData(null);
    localStorage.removeItem("ka_user");
    localStorage.removeItem("ka_profile");
    setPage("login");
  };

  const saveProfile = (data) => {
    setProfileData(data);
    localStorage.setItem("ka_profile", JSON.stringify(data));
    setPage("dashboard");
    showToast('Profile saved', 'success');
  };

  return (
    <div className="ka-app">
      {/* Navigation Bar */}
      {page !== "login" && page !== "register" && page !== "landing" && (
        <Navbar setPage={setPage} onLogout={handleLogout} profile={user} />
      )}

      {/* Professional Theme Toggle */}
      {page !== "landing" && (
        <button
          className={`ka-theme-toggle ${darkMode ? 'ka-theme-toggle--dark' : 'ka-theme-toggle--light'}`}
          onClick={() => setDarkMode(s => !s)}
          title="Toggle theme"
          aria-label="Toggle dark/light theme"
        >
          <div className="ka-theme-toggle__icon">
            {darkMode ? "🌙" : "🌞"}
          </div>
        </button>
      )}

      {/* Language Selector */}
      {page !== "landing" && (
        <div className="ka-language-selector-wrapper">
          <LanguageSelector />
        </div>
      )}

      {/* Main Application Container */}
      <main className={`ka-main ${page === "landing" ? 'ka-main--landing' : 'ka-main--app'}`}>
        {page === "landing" && <LandingPage onNavigate={setPage} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {page === "login" && <Login onLogin={handleLogin} setPage={setPage} showToast={showToast} />}
        {page === "register" && <Register onRegister={handleRegister} setPage={setPage} showToast={showToast} />}
        {page === "onboarding" && <Onboarding initial={profileData} onComplete={saveProfile} showToast={showToast} setPage={setPage} />}
        {page === "profile" && <Profile user={user} profile={profileData} setProfile={saveProfile} darkMode={darkMode} showToast={showToast} />}
        {page === "editProfile" && <EditProfile user={user} profile={profileData} setProfile={saveProfile} darkMode={darkMode} showToast={showToast} setPage={setPage} />}

        {/* NEW KODRA ROUTES */}
        {page === "dashboard" && <Dashboard profile={profileData} />}
        {page === "missions" && <Missions profile={profileData} />}
        {page === "analysis" && <Dashboard profile={profileData} />}  {/* Reusing Dashboard for now */}
        {page === "chat" && <Chat profile={profileData} darkMode={darkMode} />}
      </main>
      {/* Toast Container */}
      <div style={toastContainerStyle} aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} style={{ ...toastStyle, borderLeft: `4px solid ${t.type === 'error' ? '#dc2626' : t.type === 'success' ? '#16a34a' : '#0ea5e9'}` }}>
            <span style={{ fontWeight: 600 }}>{t.type.toUpperCase()}: </span>{t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

const toastContainerStyle = {
  position: 'fixed',
  top: 16,
  right: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  zIndex: 9999
};
const toastStyle = {
  background: '#ffffff',
  color: '#0f172a',
  padding: '10px 14px',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  fontSize: 14,
  maxWidth: 320
};
