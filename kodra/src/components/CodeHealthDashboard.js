import React from 'react';
import { useTranslation } from 'react-i18next';
import GitHubConnect from './GitHubConnect';
import apiService from '../services/api'; // Import shared API service

export default function Dashboard({ profile }) {
    const { t } = useTranslation();
    const githubUsername = profile?.githubProfile?.username;
    const [repos, setRepos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const handleAnalyze = (repoName) => {
        alert(`Analyzing ${repoName}... (This is a mock action)`);
    };

    React.useEffect(() => {
        if (githubUsername) {
            setLoading(true);
            // Simulate fetching repos
            setTimeout(() => {
                setRepos([
                    { id: 1, name: 'example-repo', html_url: '#', description: 'Sample repository', language: 'JavaScript', stargazers_count: 5, forks_count: 2, updated_at: new Date().toISOString() }
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [githubUsername]);

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            {githubUsername ? (
                <h1>{t('dashboard.welcome', { name: githubUsername })}</h1>
            ) : (
                <h1>{t('dashboard.title')}</h1>
            )}

            {githubUsername ? (
                <p>{t('dashboard.analysis_intro')}</p>
            ) : (
                <div>
                    <p>{t('dashboard.connect_repo')}</p>
                    <GitHubConnect connected={false} />
                </div>
            )}

            {/* Metrics Cards - Real-time Analysis Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={cardStyle}>
                    <h3>{t('dashboard.security_rating')}</h3>
                    <div style={{ fontSize: '48px', color: '#16a34a', fontWeight: 'bold' }}>A+</div>
                    <p>{t('dashboard.no_critical_vulns')}</p>
                </div>
                <div style={cardStyle}>
                    <h3>{t('dashboard.code_quality')}</h3>
                    <div style={{ fontSize: '48px', color: '#2563eb', fontWeight: 'bold' }}>92%</div>
                    <p>{t('dashboard.maintainability_high')}</p>
                </div>
                <div style={cardStyle}>
                    <h3>{t('dashboard.open_missions')}</h3>
                    <div style={{ fontSize: '48px', color: '#ea580c', fontWeight: 'bold' }}>3</div>
                    <p>{t('dashboard.pending_tasks')}</p>
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
