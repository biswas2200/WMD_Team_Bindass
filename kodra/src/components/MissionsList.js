import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './../global.css'; // Assuming global styles are here

// --- Mock Data ---
const generateMissions = (t) => ({
  daily: [
    { id: 'd1', title: 'Solve 5 Array Problems', xp: 50, topic: 'DSA', difficulty: 'Easy', progress: 2, total: 5 },
    { id: 'd2', title: 'Normalize a Database Table', xp: 75, topic: 'DBMS', difficulty: 'Medium', progress: 0, total: 1 },
    { id: 'd3', title: 'Implement a Java Class', xp: 40, topic: 'OOPS', difficulty: 'Easy', progress: 0, total: 1 },
  ],
  path: [
    { id: 'p1', title: 'Array Basics', level: 'beginner', topic: 'DSA', xp: 100, completed: true },
    { id: 'p2', title: 'Linked Lists Fundamentals', level: 'beginner', topic: 'DSA', xp: 150, completed: false, locked: false },
    { id: 'p3', title: 'Binary Trees', level: 'intermediate', topic: 'DSA', xp: 300, completed: false, locked: true },
    { id: 'p4', title: 'Dynamic Programming Master', level: 'advanced', topic: 'DSA', xp: 500, completed: false, locked: true },
  ],
  topics: {
    dsa: [
      { id: 't_dsa_1', title: 'Two Sum Problem', difficulty: 'Easy', xp: 20 },
      { id: 't_dsa_2', title: 'Reverse Linked List', difficulty: 'Medium', xp: 50 },
      { id: 't_dsa_3', title: 'Merge Sort Implementation', difficulty: 'Medium', xp: 60 },
    ],
    dbms: [
      { id: 't_dbms_1', title: 'Write a basic SELECT query', difficulty: 'Easy', xp: 20 },
      { id: 't_dbms_2', title: 'Design a Schema for E-commerce', difficulty: 'Hard', xp: 100 },
    ],
    oops: [
      { id: 't_oops_1', title: 'Create a Student Class', difficulty: 'Easy', xp: 30 },
      { id: 't_oops_2', title: 'Implement Inheritance', difficulty: 'Medium', xp: 50 },
    ],
    os: [
      { id: 't_os_1', title: 'Process Scheduling Algorithms', difficulty: 'Hard', xp: 90 },
      { id: 't_os_2', title: 'Explain Virtual Memory', difficulty: 'Medium', xp: 60 },
    ],
    cn: [
      { id: 't_cn_1', title: 'Explain TCP vs UDP', difficulty: 'Easy', xp: 30 },
      { id: 't_cn_2', title: 'Subnetting Practice', difficulty: 'Hard', xp: 80 },
    ],
    ml: [
      { id: 't_ml_1', title: 'Linear Regression Basics', difficulty: 'Medium', xp: 70 },
      { id: 't_ml_2', title: 'Train a Classifier', difficulty: 'Hard', xp: 120 },
    ],
  },
});

const MissionsList = ({ onSelectMission }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('daily');
  const [activeTopic, setActiveTopic] = useState('dsa'); // For 'topics' tab

  const missionsData = useMemo(() => generateMissions(t), [t]);

  // Render Daily Quest Card
  const renderDailyCard = (mission) => (
    <div key={mission.id} className="ka-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--ka-primary-500)' }} onClick={() => onSelectMission(mission)}>
      <div className="ka-card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ka-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {mission.topic} • {mission.difficulty}
          </div>
          <h4 style={{ margin: '0.25rem 0' }}>{mission.title}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(mission.progress / mission.total) * 100}%`, height: '100%', background: 'var(--ka-primary-500)' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--ka-text-muted)' }}>{mission.progress}/{mission.total}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--ka-secondary-500)' }}>+{mission.xp} XP</span>
        </div>
      </div>
    </div>
  );

  // Render Path Node
  const renderPathNode = (mission, index) => (
    <div key={mission.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', opacity: mission.locked ? 0.6 : 1 }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: mission.completed ? '#22c55e' : (mission.locked ? '#e2e8f0' : 'var(--ka-primary-500)'),
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
        marginRight: '1rem', flexShrink: 0
      }}>
        {mission.completed ? '✓' : index + 1}
      </div>
      <div className="ka-card" style={{ flex: 1, cursor: mission.locked ? 'not-allowed' : 'pointer' }} onClick={() => !mission.locked && onSelectMission(mission)}>
        <div className="ka-card-body" style={{ padding: '1rem' }}>
          <h4 style={{ margin: 0 }}>{mission.title}</h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--ka-text-muted)', marginTop: '0.25rem' }}>
            {t(`missions.levels.${mission.level}`)} • {mission.xp} XP
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="missions-container ka-fade-in">
      {/* Gamification Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>{t('missions.title')}</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="ka-badge" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d' }}>
            🔥 3 {t('missions.stats.streak')}
          </div>
          <div className="ka-badge" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>
            ⭐ 1250 {t('missions.stats.xp')}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '2px' }}>
        {['daily', 'path', 'topics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--ka-primary-500)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--ka-primary-600)' : 'var(--ka-text-muted)',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              marginBottom: '-4px'
            }}
          >
            {t(`missions.tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'daily' && (
        <div className="ka-slide-up">
          {missionsData.daily.map(renderDailyCard)}
        </div>
      )}

      {activeTab === 'path' && (
        <div className="ka-slide-up" style={{ position: 'relative', paddingLeft: '19px' }}>
          {/* Vertical Line for Path */}
          <div style={{ position: 'absolute', left: '39px', top: '20px', bottom: '50px', width: '2px', background: '#e2e8f0', zIndex: -1 }} />
          {missionsData.path.map((m, i) => renderPathNode(m, i))}
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="ka-slide-up">
          {/* Topic Selector Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {['dsa', 'dbms', 'oops', 'os', 'cn', 'ml'].map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: activeTopic === topic ? '1px solid var(--ka-primary-500)' : '1px solid #e2e8f0',
                  background: activeTopic === topic ? 'var(--ka-primary-50)' : 'white',
                  color: activeTopic === topic ? 'var(--ka-primary-700)' : 'var(--ka-text-base)',
                  cursor: 'pointer',
                  fontWeight: activeTopic === topic ? '600' : 'normal'
                }}
              >
                {topic.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Topic Mission Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {missionsData.topics[activeTopic]?.map((mission) => (
              <div key={mission.id} className="ka-card" style={{ cursor: 'pointer' }} onClick={() => onSelectMission(mission)}>
                <div className="ka-card-body">
                  <span className={`ka-badge ${mission.difficulty === 'Easy' ? 'ka-bg-success-light ka-text-success-dark' : mission.difficulty === 'Medium' ? 'ka-bg-warning-light ka-text-warning-dark' : 'ka-bg-error-light ka-text-error-dark'}`} style={{ fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                    {mission.difficulty}
                  </span>
                  <h4 style={{ margin: '0.5rem 0' }}>{mission.title}</h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--ka-secondary-600)', fontWeight: 'bold' }}>
                    +{mission.xp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionsList;
