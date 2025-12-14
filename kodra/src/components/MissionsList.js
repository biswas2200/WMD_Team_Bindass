import React, { useEffect, useState } from 'react';
import apiService from '../services/api';

const MissionsList = ({ profile, onSelectMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      if (!profile || !profile.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiService.getMissions(profile.id);
        setMissions(data || []);
      } catch (err) {
        console.error("Failed to fetch missions:", err);
        setError("Could not load missions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [profile]);

  if (loading) return <div>Loading missions...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!missions || missions.length === 0) {
    return <div>No missions available. Link GitHub to generate new missions!</div>;
  }

  return (
    <div className="missions-list">
      <h2>Your Missions</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {missions.map(mission => (
          <li
            key={mission.id}
            onClick={() => onSelectMission(mission)}
            style={{
              padding: '12px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              background: '#f9f9f9',
              marginBottom: '8px',
              borderRadius: '8px'
            }}
          >
            <strong>{mission.title}</strong>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{mission.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissionsList;
