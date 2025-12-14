import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Chat from "./components/Chat";
import CodeHealthDashboard from "./components/CodeHealthDashboard";
import MissionsList from "./components/MissionsList";
import MissionDetail from "./components/MissionDetail";
import LandingPage from "./components/LandingPage";
import LanguageSelector from "./components/LanguageSelector";
import GitHubCallback from "./components/GitHubCallback";
import "./i18n";
import "./global.css";

function App() {
  const [page, setPage] = useState("landing");
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("ka_dark")) ?? false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("ka_user")) || null);
  const [profileData, setProfileData] = useState(() => JSON.parse(localStorage.getItem("ka_profile")) || null);
  const [selectedMission, setSelectedMission] = useState(null);

  // A simple toast implementation for now
  const showToast = (msg, type = 'info', ttl = 3000) => {
    // This is a placeholder. A real implementation would use a toast library.
    console.log(`Toast: [${type}] ${msg}`);
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
    const params = new URLSearchParams(window.location.search);
    if (params.has("code")) {
      setPage("github-callback");
    }
  }, []);

  const handleLogin = (u) => {
    console.log("✅ User logged in. Raw user object:", u);

    // Log GitHub user data if available
    if (u.profile && u.profile.githubProfile) {
      console.log("GitHub User Data:", {
        username: u.profile.githubProfile.username,
        email: u.email, // Assuming the email is on the main user object
        // Note: Password is not available through GitHub OAuth
      });
    }

    const userOnly = { ...u };
    delete userOnly.profile;
    setUser(userOnly);
    localStorage.setItem("ka_user", JSON.stringify(userOnly));

    if (u.profile) {
      setProfileData(u.profile);
      localStorage.setItem("ka_profile", JSON.stringify(u.profile));
    }

    setPage("dashboard");
    showToast(`Welcome back ${u.name || ''}`, 'success');
  };

  const handleRegister = (u) => {
    console.log("✅ User registered:", u);
    setUser(u);
    localStorage.setItem("ka_user", JSON.stringify(u));
    // In a real app, you might want an onboarding flow.
    // For now, just go to the dashboard.
    setPage("dashboard");
    showToast('Registration successful!', 'success');
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
  
  const handleSelectMission = (mission) => {
    setSelectedMission(mission);
    setPage("missionDetail");
  }

  return (
    <div className="ka-app">
      {/* Navigation Bar */}
      {page !== "login" && page !== "register" && page !== "landing" && (
        <Navbar setPage={setPage} onLogout={handleLogout} profile={user} />
      )}

      {/* Professional Theme Toggle */}
      {page !== "landing" && (
        <button
          className={`ka-theme-toggle ${
            darkMode ? "ka-theme-toggle--dark" : "ka-theme-toggle--light"
          }`}
          onClick={() => setDarkMode((s) => !s)}
          title="Toggle theme"
          aria-label="Toggle dark/light theme"
        >
          <div className="ka-theme-toggle__icon">{darkMode ? "🌙" : "🌞"}</div>
        </button>
      )}

      {/* Language Selector */}
      {page !== "landing" && (
        <div className="ka-language-selector-wrapper">
          <LanguageSelector />
        </div>
      )}

      {/* Main Application Container */}
      <main
        className={`ka-main ${
          page === "landing" ? "ka-main--landing" : "ka-main--app"
        }`}
      >
        {page === "landing" && (
          <LandingPage
            onNavigate={setPage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
        {page === "login" && (
          <Login
            onLogin={handleLogin}
            setPage={setPage}
            showToast={showToast}
          />
        )}
        {page === "register" && (
          <Register
            onRegister={handleRegister}
            setPage={setPage}
            showToast={showToast}
          />
        )}
        {page === "profile" && (
          <Profile
            user={user}
            profile={profileData}
            setProfile={saveProfile}
            darkMode={darkMode}
            showToast={showToast}
          />
        )}
        {page === "editProfile" && (
          <EditProfile
            user={user}
            profile={profileData}
            setProfile={saveProfile}
            darkMode={darkMode}
            showToast={showToast}
            setPage={setPage}
          />
        )}
        {page === "github-callback" && (
          <GitHubCallback
            onLogin={handleLogin}
            setPage={setPage}
            showToast={showToast}
          />
        )}
        {/* NEW KODRA ROUTES */}
        {page === "dashboard" && <CodeHealthDashboard profile={profileData} />}
        {page === "missions" && (
          <MissionsList
            profile={profileData}
            onSelectMission={handleSelectMission}
          />
        )}
        {page === "missionDetail" && (
          <MissionDetail mission={selectedMission} />
        )}
        {page === "analysis" && <CodeHealthDashboard profile={profileData} />}{" "}
        {/* Reusing Dashboard for now */}
        {page === "chat" && <Chat profile={profileData} darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default App;
