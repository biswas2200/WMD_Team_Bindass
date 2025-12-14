import React from 'react';

const MissionsList = ({ missions, onSelectMission }) => {
  if (!missions || missions.length === 0) {
    return <div>No missions available.</div>;
  }

  return (
    <div className="missions-list">
      <h2>Missions</h2>
      <ul>
        {missions.map(mission => (
          <li key={mission.id} onClick={() => onSelectMission(mission)}>
            {mission.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissionsList;
