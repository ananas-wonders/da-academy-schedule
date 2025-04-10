
import React from 'react';
import SessionCard, { SessionCardProps } from './SessionCard';
import { cn } from '@/lib/utils';

export interface Track {
  id: string;
  name: string;
}

export interface Day {
  id: string;
  name: string;
  date: string;
  isFriday?: boolean;
}

export interface Session extends SessionCardProps {
  id: string;
  dayId: string;
  trackId: string;
}

export type ViewDensity = '1week' | '2weeks' | 'month' | '2months';

interface ScheduleGridProps {
  days: Day[];
  tracks: Track[];
  sessions: Session[];
  viewDensity: ViewDensity;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  days, 
  tracks, 
  sessions,
  viewDensity
}) => {
  // Function to get sessions for a specific day and track
  const getSessionsForCell = (dayId: string, trackId: string) => {
    return sessions.filter(
      session => session.dayId === dayId && session.trackId === trackId
    ).slice(0, 5); // Limit to 5 cards per cell
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="w-[180px] bg-gray-50 p-3 font-semibold text-left border-b border-r border-gray-200"></th>
            {tracks.map(track => (
              <th key={track.id} className="min-w-[250px] bg-gray-50 p-3 font-semibold text-center border-b border-r border-gray-200">
                {track.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day.id} className={cn(day.isFriday ? "bg-gray-100" : "")}>
              <td className={cn(
                "w-[180px] bg-gray-50 p-3 font-medium text-left border-b border-r border-gray-200 sticky left-0",
                day.isFriday ? "bg-gray-200" : ""
              )}>
                <div className="font-semibold">{day.name}</div>
                <div className="text-xs text-gray-500">{day.date}</div>
              </td>
              {tracks.map(track => {
                const cellSessions = getSessionsForCell(day.id, track.id);
                return (
                  <td 
                    key={`${day.id}-${track.id}`} 
                    className={cn(
                      "min-w-[250px] p-2 border-b border-r border-gray-200 align-top",
                      day.isFriday ? "bg-gray-100" : ""
                    )}
                  >
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
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleGrid;
