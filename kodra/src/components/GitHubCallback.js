import { useEffect } from 'react';
import api from '../services/api';

const GitHubCallback = ({ onLogin, setPage, showToast }) => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      if (window.githubProcessing) {
        showToast("GitHub login already in progress.", "info");
        return;
      }
      window.githubProcessing = true;

      window.history.replaceState({}, document.title, window.location.pathname);
      showToast("GitHub code received. Contacting backend...", "info");

      api.loginWithGitHub(code)
        .then(loginData => {
          showToast("Backend verified GitHub user.", "info");
          if (loginData && loginData.user) {
            showToast("Fetching user profile...", "info");
            return api.getStudentCombined(loginData.user.id)
              .then(combined => {
                const combinedProfile = combined?.data?.profile || loginData.profile || {};
                const fullUserData = {
                  ...loginData.user,
                  profile: combinedProfile,
                  token: loginData.token,
                  type: loginData.type || 'Bearer'
                };
                onLogin(fullUserData);
                showToast("Login successful! Redirecting to dashboard...", "success");
                setPage('dashboard');
              })
              .catch(e => {
                showToast("Login successful, but failed to fetch full profile.", "warning");
                const basicUserData = {
                    ...loginData.user,
                    profile: loginData.profile || {},
                    token: loginData.token,
                    type: loginData.type || 'Bearer'
                };
                onLogin(basicUserData);
                setPage('dashboard');
              });
          } else {
            throw new Error('Invalid user data from backend');
          }
        })
        .catch(err => {
          showToast(`GitHub Login Failed: ${err.message}`, "error");
          setPage('login');
        })
        .finally(() => {
          window.githubProcessing = false;
        });
    } else {
        showToast("GitHub login failed: No authorization code.", "error");
        setPage('login');
    }
  }, [onLogin, setPage, showToast]);

  return <div>Processing GitHub login... You will be redirected shortly.</div>;
};

export default GitHubCallback;
