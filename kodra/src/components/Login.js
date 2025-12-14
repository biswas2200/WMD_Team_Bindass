import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ApiService from "../services/api";

export default function Login({ onLogin, setPage, showToast }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = () => {
    setLoading(true);
    const CLIENT_ID =
      process.env.REACT_APP_GITHUB_CLIENT_ID || ""; // Fallback or env
    const REDIRECT_URI = window.location.origin; // Redirects back to same page
    const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo,user:email`;
    window.location.href = url;
  };

  const submit = async (e) => {
    e.preventDefault();

    console.log("🔐 Login form submitted");

    if (!email || !password) {
      showToast && showToast("Please fill in all fields", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast && showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Sending login request to backend for:", email);
      const response = await ApiService.login({ email, password });
      console.log("✅ Login successful:", response);

      // Handle the login response with token and user data
      if (response.token) localStorage.setItem("authToken", response.token);
      if (response.user) {
        localStorage.setItem("studentEmail", response.user.email);
        localStorage.setItem("studentId", response.user.id);
        // Attempt combined student fetch for richer profile
        let combinedProfile = response.profile || {};
        try {
          const combined = await ApiService.getStudentCombined(
            response.user.id
          );
          if (combined?.data?.profile) combinedProfile = combined.data.profile;
        } catch (e) {
          console.warn(
            "⚠️ Combined student fetch failed, falling back to basic profile:",
            e.message
          );
        }
        localStorage.setItem("ka_profile", JSON.stringify(combinedProfile));
        onLogin({
          ...response.user,
          profile: combinedProfile,
          token: response.token,
          type: response.type || "Bearer",
        });
        showToast &&
          showToast(`Welcome back, ${response.user.name}!`, "success");
      } else throw new Error("Invalid response format");
    } catch (error) {
      console.error("❌ Login failed:", error);
      showToast &&
        showToast(
          "Login failed: " + (error.message || "Invalid credentials"),
          "error"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🎨 CSS for interactive styles */}
      <style jsx>{`
        input:focus {
          border-color: #00b4d8 !important;
          background: white !important;
          box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.1) !important;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 180, 216, 0.3);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          div[style*="display: flex"][style*="height: 100vh"] {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
          }

          div[style*="flex: 1"][style*="backgroundImage"] {
            min-height: 40vh;
            flex: none;
          }

          div[style*="padding: 60px 50px"] {
            padding: 30px 20px;
            flex: 1;
            min-height: 60vh;
          }

          input {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
        }

        @media (max-width: 480px) {
          div[style*="flex: 1"][style*="backgroundImage"] {
            min-height: 30vh;
          }

          div[style*="padding: 60px 50px"] {
            padding: 20px 15px;
          }
        }
      `}</style>

      <div style={outerContainer}>
        {/* Left Image */}
        <div style={imageWrapperUnified}>
          <img src="/login.jpg" alt="Kodra.ai" style={imageStyle} />
          <div style={imageOverlayUnified}>
            <h2 style={overlayTitleUnified}>
              {t("auth.login.welcome", "Welcome Back")}
            </h2>
            <p style={overlayTextUnified}>
              {t(
                "auth.login.tagline",
                "Continue your developer journey with us"
              )}
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div style={formWrapperUnified}>
          <h1 style={formTitleUnified}>{t("auth.login.title", "Sign In")}</h1>
          <p style={formSubtitleUnified}>
            {t(
              "auth.login.subtitle",
              "Access your personalized development dashboard"
            )}
          </p>

          <form onSubmit={submit} style={formStyleUnified}>
            <div style={formRowStyleUnified}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.login.email", "Email Address")}
                style={inputStyle}
                required
              />
            </div>

            <div style={formRowStyleUnified}>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.login.password", "Password")}
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                ...btnStyleUnified,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={spinnerStyle}>⟳</span>
                  {t("auth.login.signingin", "Signing In...")}
                </>
              ) : (
                t("auth.login.signin", "Sign In")
              )}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: 420,
              margin: "20px 0",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", background: "#e0e0e0" }}
            ></div>
            <div style={{ margin: "0 10px", color: "#6c757d", fontSize: 14 }}>
              OR
            </div>
            <div
              style={{ flex: 1, height: "1px", background: "#e0e0e0" }}
            ></div>
          </div>

          <button
            onClick={handleGitHubLogin}
            style={{
              ...btnStyleUnified,
              background: "#24292e",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={spinnerStyle}>⟳</span>
                Redirecting to GitHub...
              </>
            ) : (
              <>
                <svg
                  height="20"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="20"
                  aria-hidden="true"
                  style={{ fill: "white" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                  ></path>
                </svg>
                Login with GitHub
              </>
            )}
          </button>

          <div style={linkContainerUnified}>
            <p style={{ margin: 0, color: "#6c757d", fontSize: 14 }}>
              {t("auth.login.noAccount", "Don't have an account?")}{" "}
              <span
                style={linkStyleUnified}
                onClick={() => setPage("register")}
              >
                {t("auth.login.signup", "Sign up")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Unified styles aligning with Register component
const outerContainer = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  maxWidth: 1200,
  minHeight: "90vh",
  margin: "20px auto",
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(2,6,23,0.15)",
  background: "white",
};

const imageWrapperUnified = {
  flex: 1,
  position: "relative",
  minWidth: 0,
  minHeight: "600px",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const imageOverlayUnified = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(135deg, rgba(0,180,216,0.8), rgba(0,119,182,0.8))",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  textAlign: "center",
  padding: 40,
};

const overlayTitleUnified = {
  margin: 0,
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 15,
};
const overlayTextUnified = { fontSize: 18, opacity: 0.95, lineHeight: 1.5 };

const formWrapperUnified = {
  flex: 1.2,
  padding: "40px 50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 0,
  boxSizing: "border-box",
  overflowY: "auto",
  maxHeight: "90vh",
};

const formTitleUnified = {
  margin: 0,
  color: "#0077b6",
  fontSize: 30,
  fontWeight: 700,
  textAlign: "center",
};
const formSubtitleUnified = {
  color: "#6c757d",
  marginBottom: 24,
  fontSize: 16,
  textAlign: "center",
  maxWidth: 420,
};

const formStyleUnified = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
  marginTop: 10,
  width: "100%",
  maxWidth: 420,
};
const formRowStyleUnified = {
  display: "flex",
  gap: 15,
  marginBottom: 16,
  justifyContent: "center",
};

const inputStyle = {
  padding: "14px 16px",
  borderRadius: 12,
  border: "2px solid #e9ecef",
  background: "#fafbfc",
  color: "#212529",
  fontSize: 15,
  transition: "all 0.3s ease",
  flex: 1,
  fontFamily: "inherit",
};

const btnStyleUnified = {
  padding: "16px 20px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #00b4d8, #0077b6)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 16,
  transition: "all 0.3s ease",
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  maxWidth: 420,
  alignSelf: "center",
};

const spinnerStyle = {
  display: "inline-block",
  animation: "spin 1s linear infinite",
  fontSize: 16,
};

const linkContainerUnified = {
  marginTop: 20,
  textAlign: "center",
  color: "#6c757d",
  fontSize: 14,
  width: "100%",
  maxWidth: 420,
};
const linkStyleUnified = {
  color: "#0077b6",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "underline",
};
