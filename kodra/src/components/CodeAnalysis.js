import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './../global.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CodeAnalysis = () => {
    const { t } = useTranslation();
    const [code, setCode] = useState(t('analysis_tool.editor_placeholder', '// Write your code...'));
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [activeTab, setActiveTab] = useState('tests');

    // --- Mock Analysis Logic ---
    const handleRunAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setResults({
                tests: [
                    { id: 1, passed: true, input: '[1, 2, 3]', expected: '6', actual: '6' },
                    { id: 2, passed: true, input: '[-1, 1]', expected: '0', actual: '0' },
                    { id: 3, passed: false, input: '[10, -5]', expected: '5', actual: '10' }, // Intentionally failing for demo
                ],
                complexity: {
                    time: 'O(n²)',
                    space: 'O(1)',
                    score: 65, // out of 100
                },
                staticAnalysis: [
                    { type: 'warning', msg: 'Unused variable `temp` found at line 5.' },
                    { type: 'info', msg: 'Consider using `const` instead of `let`.' },
                ],
                aiTip: 'Your solution works for basic cases, but the nested loop causes O(n²) time complexity. Try using a Hash Map to reduce lookup time to O(1), bringing overall complexity to O(n).'
            });
            setAnalyzing(false);
        }, 1500); // Simulate network delay
    };

    const handleApplyFix = () => {
        const optimizedCode = `// Optimized O(n) Solution using Hash Map

function solve(arr) {
  const map = new Map();
  // ... efficient logic ...
  return arr.filter(item => !map.has(item)); 
}`;
        setCode(optimizedCode);
        alert("Optimized code applied!");
    };

    // --- Charts Data ---
    const complexityData = {
        labels: ['10', '100', '1000', '10000', '100000'],
        datasets: [
            {
                label: 'Your Code O(n²)',
                data: [100, 10000, 1000000, 100000000, 200000000], // quadratic growth
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.3,
            },
            {
                label: 'Optimal O(n)',
                data: [10, 100, 1000, 10000, 100000], // linear growth
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="ka-container ka-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="ka-text-3xl ka-font-bold">{t('analysis_tool.title')}</h1>
                    <p className="ka-text-muted">{t('analysis_tool.subtitle')}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="ka-btn ka-btn-outline" onClick={() => setCode('')}>
                        {t('analysis_tool.actions.clear')}
                    </button>
                    <button
                        className="ka-btn ka-btn-primary"
                        onClick={handleRunAnalysis}
                        disabled={analyzing}
                    >
                        {analyzing ? (
                            <>🔄 {t('analysis_tool.actions.analyzing')}</>
                        ) : (
                            <>▶️ {t('analysis_tool.actions.run')}</>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Split View */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>

                {/* Left: Code Editor (Simulated) */}
                <div className="ka-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #334155' }}>
                    <div style={{ background: '#1e293b', padding: '0.5rem 1rem', color: '#94a3b8', borderBottom: '1px solid #334155', fontSize: '0.85rem' }}>
                        main.js
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{
                            flex: 1,
                            background: '#0f172a',
                            color: '#38bdf8', // Cyan for code
                            fontFamily: '"Fira Code", monospace',
                            fontSize: '1rem',
                            border: 'none',
                            resize: 'none',
                            padding: '1rem',
                            lineHeight: '1.5',
                            outline: 'none'
                        }}
                        spellCheck="false"
                    />
                </div>

                {/* Right: Analysis Results */}
                <div className="ka-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        {['tests', 'complexity', 'static', 'ai'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    border: 'none',
                                    background: activeTab === tab ? 'white' : 'transparent',
                                    borderBottom: activeTab === tab ? '2px solid var(--ka-primary-500)' : 'none',
                                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                                    color: activeTab === tab ? 'var(--ka-primary-600)' : 'var(--ka-text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                {/* Basic labels handling if translation key missing */}
                                {tab === 'tests' ? t('analysis_tool.tabs.test_results') :
                                    tab === 'complexity' ? t('analysis_tool.tabs.complexity') :
                                        tab === 'static' ? t('analysis_tool.tabs.static') :
                                            t('analysis_tool.tabs.ai_feedback')}
                            </button>
                        ))}
                    </div>

                    <div className="ka-card-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {!results && !analyzing && (
                            <div style={{ textAlign: 'center', color: 'var(--ka-text-muted)', marginTop: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                                <p>Click "Run Code" to start analysis.</p>
                            </div>
                        )}

                        {analyzing && (
                            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                                <div className="ka-spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--ka-primary-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                <p>{t('analysis_tool.actions.analyzing')}</p>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        )}

                        {results && (
                            <>
                                {/* TEST RESULTS TAB */}
                                {activeTab === 'tests' && (
                                    <div>
                                        {results.tests.map(test => (
                                            <div key={test.id} style={{ marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                                <div style={{
                                                    padding: '0.75rem 1rem',
                                                    background: test.passed ? '#f0fdf4' : '#fef2f2',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    borderBottom: '1px solid #e2e8f0'
                                                }}>
                                                    <span style={{ fontWeight: 'bold', color: test.passed ? '#15803d' : '#b91c1c' }}>
                                                        {test.passed ? `✅ ${t('analysis_tool.report.passed')}` : `❌ ${t('analysis_tool.report.failed')}`}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Test Case #{test.id}</span>
                                                </div>
                                                <div style={{ padding: '1rem', fontSize: '0.9rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--ka-text-muted)', textTransform: 'uppercase' }}>{t('analysis_tool.report.input')}</div>
                                                        <code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'block', marginTop: '0.25rem' }}>{test.input}</code>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--ka-text-muted)', textTransform: 'uppercase' }}>{t('analysis_tool.report.expected')}</div>
                                                        <code style={{ background: '#f0fdf4', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'block', marginTop: '0.25rem', color: '#15803d' }}>{test.expected}</code>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--ka-text-muted)', textTransform: 'uppercase' }}>{t('analysis_tool.report.actual')}</div>
                                                        <code style={{ background: test.passed ? '#f0fdf4' : '#fef2f2', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'block', marginTop: '0.25rem', color: test.passed ? '#15803d' : '#b91c1c' }}>{test.actual}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* COMPLEXITY TAB */}
                                {activeTab === 'complexity' && (
                                    <div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                            <div style={{ padding: '1rem', borderRadius: '8px', background: '#fff1f2', border: '1px solid #fecdd3' }}>
                                                <div style={{ fontSize: '0.8rem', color: '#be123c', textTransform: 'uppercase' }}>{t('analysis_tool.report.time_complexity')}</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9f1239' }}>{results.complexity.time}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#e11d48' }}>Slow for large inputs ⚠️</div>
                                            </div>
                                            <div style={{ padding: '1rem', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                                <div style={{ fontSize: '0.8rem', color: '#15803d', textTransform: 'uppercase' }}>{t('analysis_tool.report.space_complexity')}</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d' }}>{results.complexity.space}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>Efficient ✅</div>
                                            </div>
                                        </div>
                                        <div style={{ height: '300px' }}>
                                            <Line
                                                options={{ responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Growth Rate Comparison' } } }}
                                                data={complexityData}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STATIC ANALYSIS TAB */}
                                {activeTab === 'static' && (
                                    <div>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {results.staticAnalysis.map((item, idx) => (
                                                <li key={idx} style={{ padding: '1rem', marginBottom: '0.5rem', background: item.type === 'warning' ? '#fffbeb' : '#f0f9ff', borderLeft: `4px solid ${item.type === 'warning' ? '#f59e0b' : '#3b82f6'}`, borderRadius: '4px' }}>
                                                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: item.type === 'warning' ? '#b45309' : '#1e40af' }}>
                                                        {item.type === 'warning' ? '⚠️ Warning' : 'ℹ️ Info'}
                                                    </div>
                                                    <div>{item.msg}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* AI FEEDBACK TAB */}
                                {activeTab === 'ai' && (
                                    <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '2rem' }}>🤖</span>
                                            <h3 style={{ margin: 0, color: '#1e3a8a' }}>Kodra AI Says:</h3>
                                        </div>
                                        <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#334155' }}>
                                            {results.aiTip}
                                        </p>
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <button
                                                className="ka-btn ka-btn-sm ka-btn-primary"
                                                onClick={handleApplyFix}
                                            >
                                                Apply Fix
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeAnalysis;
