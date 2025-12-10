import React from 'react';

const GitHubConnect = ({ onConnect, connected = false, githubUsername }) => {
    const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || 'Ov23liy5ZfHjgE892y06'; // Fallback or env
    const REDIRECT_URI = window.location.origin; // Redirects back to same page

    const handleConnect = () => {
        const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo,user:email`;
        window.location.href = url;
    };

    if (connected) {
        return (
            <div style={connectedStyle}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: '#0f5132' }}>GitHub Connected</span>
                    {githubUsername && <span style={{ fontSize: 13, color: '#155724' }}>@{githubUsername}</span>}
                </div>
            </div>
        );
    }

    return (
        <button onClick={handleConnect} style={btnStyle}>
            <svg height="20" viewBox="0 0 16 16" version="1.1" width="20" aria-hidden="true" style={{ fill: 'white' }}>
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            Connect GitHub
        </button>
    );
};

const btnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: '#24292e',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};

const connectedStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    background: '#d1e7dd',
    border: '1px solid #badbcc',
    borderRadius: 8,
    color: '#0f5132'
};

export default GitHubConnect;
