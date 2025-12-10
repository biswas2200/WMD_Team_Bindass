import React from 'react';

export default function Missions({ profile }) {
    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Your Missions</h1>
            <p>Complete these coding missions to level up your skills and improve your codebase.</p>

            <div style={{ marginTop: '30px' }}>
                {/* SPONSOR MISSION: Cline */}
                <div style={{ ...missionCardStyle, borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Mission 0: Activate AI Mentor (Cline)</h3>
                        <span style={{ ...xpBadgeStyle, background: '#ede9fe', color: '#6d28d9' }}>+1000 XP</span>
                    </div>
                    <p>Install the <strong>Cline</strong> VS Code extension to get an AI pair programmer that knows your Kodra missions.</p>
                    <div style={{ marginTop: '12px', padding: '12px', background: '#f5f3ff', borderRadius: '8px', fontSize: '14px' }}>
                        <strong>Instructions:</strong>
                        <ol style={{ paddingLeft: '20px', marginTop: '8px' }}>
                            <li>Install "Cline" from VS Code Marketplace.</li>
                            <li>Open a workspace in VS Code.</li>
                            <li>Cline will automatically detect the <code>.clinerules</code> file and adopt the Kodra Mentor persona!</li>
                        </ol>
                    </div>
                    <button style={{ ...buttonStyle, background: '#7c3aed' }}>Verify Installation</button>
                </div>

                <div style={missionCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Fix SQL Injection Vulnerability</h3>
                        <span style={xpBadgeStyle}>+500 XP</span>
                    </div>
                    <p>We detected a potential SQL injection in <code>LoginController.java</code>. Use prepared statements to fix it.</p>
                    <button style={buttonStyle}>Start Mission</button>
                </div>

                <div style={missionCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Optimize Database Query</h3>
                        <span style={xpBadgeStyle}>+300 XP</span>
                    </div>
                    <p>The query in <code>UserService.getUser</code> is performing a full table scan. Add an index to improve performance.</p>
                    <button style={buttonStyle}>Start Mission</button>
                </div>
            </div>
        </div>
    );
}

const missionCardStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    marginBottom: '20px'
};

const xpBadgeStyle = {
    background: '#fef3c7',
    color: '#d97706',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px'
};

const buttonStyle = {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '16px'
};
