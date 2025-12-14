import React from 'react';

const MissionDetail = ({ mission }) => {
  if (!mission) {
    return <div>Select a mission to see the details.</div>;
  }

  return (
    <div className="mission-detail">
      <h2>{mission.title}</h2>
      <p>{mission.description}</p>
      {/* More mission details will go here */}
    </div>
  );
};

export default MissionDetail;
