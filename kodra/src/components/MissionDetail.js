import React from 'react';
import { useTranslation } from 'react-i18next';
import './../global.css';

const MissionDetail = ({ mission }) => {
  const { t } = useTranslation();

  if (!mission) {
    return (
      <div className="ka-card ka-fade-in" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--ka-text-muted)', textAlign: 'center', padding: '2rem' }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <p>{t('missions.select_mission')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mission-detail ka-card ka-slide-up" style={{ position: 'sticky', top: '20px' }}>
      <div className="ka-card-header" style={{ background: 'linear-gradient(to right, var(--ka-primary-50), white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span className="ka-badge" style={{ background: 'var(--ka-primary-100)', color: 'var(--ka-primary-700)' }}>
            {mission.topic || 'General'}
          </span>
          <span style={{ fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            ⭐ {mission.xp} XP
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--ka-text-heading)' }}>{mission.title}</h2>
      </div>

      <div className="ka-card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>{t('missions.levels.intermediate') || 'Difficulty'}</div>
            <div style={statValueStyle}>{mission.difficulty || 'Normal'}</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Status</div>
            <div style={statValueStyle}>{mission.completed ? 'Completed' : 'Active'}</div>
          </div>
        </div>

        <p style={{ lineHeight: '1.6', color: 'var(--ka-text-base)', marginBottom: '2rem' }}>
          {mission.description || `Complete this mission to master crucial ${mission.topic || 'coding'} concepts. This task is designed to improve your problem-solving skills and code efficiency.`}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          {!mission.completed ? (
            <>
              <button className="ka-btn ka-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert('Mission Started! Good luck!')}>
                {t('missions.actions.start') || 'Start Mission'}
              </button>
              <button className="ka-btn ka-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                View Resources
              </button>
            </>
          ) : (
            <button className="ka-btn ka-btn-success" style={{ width: '100%', justifyContent: 'center', cursor: 'default' }} disabled>
              ✅ {t('missions.actions.complete') || 'Completed'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const statBoxStyle = {
  background: '#f8fafc',
  padding: '1rem',
  borderRadius: '8px',
  textAlign: 'center',
  border: '1px solid #e2e8f0'
};

const statLabelStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.25rem'
};

const statValueStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#0f172a'
};

export default MissionDetail;
