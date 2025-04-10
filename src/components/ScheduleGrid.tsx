
import React from 'react';
import SessionCard, { SessionCardProps } from './SessionCard';

export interface Track {
  id: string;
  name: string;
}

export interface Day {
  id: string;
  name: string;
}

export interface Session extends SessionCardProps {
  id: string;
  dayId: string;
  trackId: string;
}

interface ScheduleGridProps {
  days: Day[];
  tracks: Track[];
  sessions: Session[];
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ days, tracks, sessions }) => {
  // Function to get sessions for a specific day and track
  const getSessionsForCell = (dayId: string, trackId: string) => {
    return sessions.filter(
      session => session.dayId === dayId && session.trackId === trackId
    ).slice(0, 5); // Limit to 5 cards per cell
  };

  return (
    <div className="overflow-x-auto">
      <div 
        className="schedule-grid"
        style={{ gridTemplateColumns: `150px repeat(${tracks.length}, minmax(200px, 1fr))` }}
      >
        {/* Header row with track names */}
        <div className="day-row" style={{ gridTemplateColumns: `150px repeat(${tracks.length}, minmax(200px, 1fr))` }}>
          <div className="day-header"></div> {/* Empty corner cell */}
          {tracks.map(track => (
            <div key={track.id} className="track-header">
              {track.name}
            </div>
          ))}
        </div>

        {/* Day rows */}
        {days.map(day => (
          <div 
            key={day.id} 
            className="day-row"
            style={{ gridTemplateColumns: `150px repeat(${tracks.length}, minmax(200px, 1fr))` }}
          >
            <div className="day-header">{day.name}</div>
            {tracks.map(track => {
              const cellSessions = getSessionsForCell(day.id, track.id);
              return (
                <div key={`${day.id}-${track.id}`} className="session-cell">
                  {cellSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      title={session.title}
                      instructor={session.instructor}
                      type={session.type}
                      count={session.count}
                      total={session.total}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;
