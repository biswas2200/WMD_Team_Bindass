import React from 'react';

export default function Dashboard({ profile }) {
    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Repo Health Dashboard</h1>
            <p>Connect a repository to see your code analysis stats, security vulnerabilities, and quality metrics.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
                <div style={cardStyle}>
                    <h3>Security Rating</h3>
                    <div style={{ fontSize: '48px', color: '#16a34a', fontWeight: 'bold' }}>A+</div>
                    <p>No critical vulnerabilities found</p>
                </div>
                <div style={cardStyle}>
                    <h3>Code Quality</h3>
                    <div style={{ fontSize: '48px', color: '#2563eb', fontWeight: 'bold' }}>92%</div>
                    <p>Maintainability index is high</p>
                </div>
                <div style={cardStyle}>
                    <h3>Open Missions</h3>
                    <div style={{ fontSize: '48px', color: '#ea580c', fontWeight: 'bold' }}>3</div>
                    <p>Pending refactoring tasks</p>
                </div>
            </div>
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
