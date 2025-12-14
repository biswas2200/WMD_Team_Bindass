import React, { useEffect, useState } from 'react';
import GitHubConnect from './GitHubConnect';
import apiService from '../services/api'; // Import shared API service

export default function Dashboard({ profile }) {
    // Robustly extract GitHub data from flat or nested profile structure
    const githubUsername = profile?.githubUsername || profile?.githubProfile?.username;
    // Extract access token (Note: In production, do not expose tokens to frontend unless necessary. 
    // Here we use it for client-side "Real Time" fetching as requested)
    const accessToken = profile?.accessToken || profile?.githubProfile?.accessToken;

    const [repos, setRepos] = useState([]);
    const [analysis, setAnalysis] = useState(null); // Fix: Define state
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (accessToken) {
            setLoading(true);
            // Fetch real repositories from GitHub API
            fetch('https://api.github.com/user/repos?sort=updated&per_page=6', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('GitHub API failed');
                })
                .then(data => {
                    if (Array.isArray(data)) setRepos(data);
                    setLoading(false);
                })
                .catch(e => {
                    console.error("Failed to fetch repos:", e);
                    setLoading(false);
                });

            // 2. Fetch Kodra Analysis (Real-Time Health) from Backend
            // Use ApiService to ensure correct Base URL (including /api context) and Auth Headers
            const userId = profile?.user?.id || profile?.id || JSON.parse(localStorage.getItem('ka_user'))?.id;

            if (userId) {
                // Determine API base URL (hardcoded for now to match other parts of the app or env)
                // Assuming localhost:8081 as per logs
                const API_BASE = 'http://localhost:8081'; // Just in case this block reverted or similar logic exists elsewhere. 
                // Wait, I replaced this entire block with apiService usage in step 2067. 
                // So I shouldn't need to change `CodeHealthDashboard.js` UNLESS I see it defaulted back or was only partially applied.
                // Let's verify `CodeHealthDashboard.js` content first.
                apiService.apiFetch(`/analysis/latest?userId=${userId}`)
                    .then(data => {
                        if (data && data.securityScore !== undefined) setAnalysis(data);
                    })
                    .catch(e => console.error("Analysis fetch failed", e));
            }
        }
    }, [accessToken, profile]);

    // Calculate real-ish metrics based on repos
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const openIssues = repos.reduce((acc, repo) => acc + (repo.open_issues_count || 0), 0);
    const mainLanguage = repos[0]?.language || 'JavaScript';

    // Fix: Define scores derived from analysis
    const securityScore = analysis ? analysis.securityScore : 'N/A';
    const logicScore = analysis ? analysis.logicScore : 'N/A';
    const perfScore = analysis ? analysis.performanceScore : 'N/A';

    const handleAnalyze = (repoName) => {
        setLoading(true);
        const userId = profile?.user?.id || profile?.id || JSON.parse(localStorage.getItem('ka_user'))?.id;

        if (userId) {
            apiService.apiFetch(`/analysis/analyze-repo?userId=${userId}&repoName=${repoName}`, { method: 'POST' })
                .then(data => {
                    if (data) setAnalysis(data);
                })
                .catch(e => console.error("Analysis failed", e))
                .finally(() => setLoading(false));
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            {githubUsername ? (
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {profile?.avatarUrl && <img src={profile.avatarUrl} alt={githubUsername} style={{ width: 60, height: 60, borderRadius: '50%' }} />}
                        <div>
                            <h1 style={{ margin: 0 }}>Welcome, {githubUsername}!</h1>
                            <p style={{ color: '#64748b', margin: '5px 0 0' }}>
                                <span style={{ color: '#22c55e' }}>● Connected to GitHub</span> | Real-time Analysis Active
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <h1>Repo Health Dashboard</h1>
            )}

            {!githubUsername && (
                <div style={{ marginBottom: '40px' }}>
                    <p>Connect a repository to see your code analysis stats, security vulnerabilities, and quality metrics.</p>
                    <GitHubConnect connected={false} />
                </div>
            )}

            {/* Metrics Cards - Real-time Analysis Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={cardStyle}>
                    <h3>Security Score</h3>
                    <div style={{ fontSize: '48px', color: '#dc2626', fontWeight: 'bold' }}>{loading ? '...' : securityScore}%</div>
                    <p>⚠️ Critical Issues Detected</p>
                </div>
                <div style={cardStyle}>
                    <h3>Logic Score</h3>
                    <div style={{ fontSize: '48px', color: '#16a34a', fontWeight: 'bold' }}>{loading ? '...' : logicScore}%</div>
                    <p>Code structure is solid</p>
                </div>
                <div style={cardStyle}>
                    <h3>Performance Score</h3>
                    <div style={{ fontSize: '48px', color: '#ea580c', fontWeight: 'bold' }}>{loading ? '...' : perfScore}%</div>
                    <p>Optimization needed</p>
                </div>
            </div>

            {/* Repo List */}
            {githubUsername && (
                <div style={{ marginTop: '40px' }}>
                    <h2>Recent Repositories</h2>
                    <p style={{ color: '#64748b' }}>Select a repository to run a detailed analysis.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '20px' }}>
                        {loading ? <p>Loading repositories...</p> : repos.map(repo => (
                            <div key={repo.id} style={repoCardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b6', textDecoration: 'none' }}>
                                            {repo.name}
                                        </a>
                                        {repo.private && <span style={badgeStyle}>Private</span>}
                                    </h3>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                                </div>
                                <p style={{ color: '#475569', margin: '10px 0' }}>{repo.description || 'No description provided.'}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#64748b' }}>
                                        <span>🔵 {repo.language || 'N/A'}</span>
                                        <span>⭐ {repo.stargazers_count}</span>
                                        <span>🍴 {repo.forks_count}</span>
                                    </div>
                                    <button
                                        onClick={() => handleAnalyze(repo.name)}
                                        style={{
                                            padding: '8px 16px',
                                            background: '#2563eb',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Analyze ⚡
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const cardStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
};

const repoCardStyle = {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s ease'
};

const badgeStyle = {
    background: '#e2e8f0',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    marginLeft: '10px',
    color: '#475569'
};
