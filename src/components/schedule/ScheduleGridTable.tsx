
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { isSameDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Track, Day, Session } from '@/types/schedule';
import SortableTrack from './SortableTrack';
import SessionCard from '@/components/SessionCard';
import AddSessionForm from '@/components/AddSessionForm';
import { SessionCardProps } from '@/components/SessionCard';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';

interface ScheduleGridTableProps {
  days: Day[];
  visibleTracks: Track[];
  sessions: Session[];
  today: Date;
  onEditSession: (sessionId: string) => void;
  onAddSession: (dayId: string, trackId: string, newSession: Omit<SessionCardProps, 'id'>) => void;
  onEditTrackName: (id: string, newName: string) => void;
  onToggleTrackVisibility: (trackId: string, visible: boolean) => void;
  onCopyTrackLink: (trackId: string, trackName: string) => void;
  onAddTrack: () => void;
  hasConflict: (session: Session) => boolean;
  getSessionsForCell: (dayId: string, trackId: string) => Session[];
  getTrackGroup: (track: Track) => { id: string; name: string; color?: string } | null;
}

const ScheduleGridTable: React.FC<ScheduleGridTableProps> = ({
  days,
  visibleTracks,
  sessions,
  today,
  onEditSession,
  onAddSession,
  onEditTrackName,
  onToggleTrackVisibility,
  onCopyTrackLink,
  onAddTrack,
  hasConflict,
  getSessionsForCell,
  getTrackGroup
}) => {
  const trackIds = visibleTracks.map(track => track.id);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  
  const { getOccupiedTimeSlots } = useAvailableTimeSlots(sessions);

  const handleOpenAddSession = (dayId: string, trackId: string) => {
    setSelectedDayId(dayId);
    setSelectedTrackId(trackId);
  };

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="w-[180px] bg-gray-50 p-3 font-semibold text-left border-b border-r border-gray-200"></th>
          <SortableContext items={trackIds} strategy={horizontalListSortingStrategy}>
            {visibleTracks.map((track) => {
              const group = getTrackGroup(track);
              return (
                <SortableTrack 
                  key={track.id} 
                  track={track} 
                  onEditName={onEditTrackName}
                  groupName={group?.name}
                  groupColor={group?.color}
                  grouped={!!track.groupId}
                  onToggleVisibility={onToggleTrackVisibility}
                  onCopyLink={onCopyTrackLink}
                  onAddTrack={onAddTrack}
                />
              );
            })}
          </SortableContext>
        </tr>
      </thead>
      <tbody>
        {days.map(day => (
          <tr key={day.id} className={cn(
            "h-auto border-b border-gray-200",
            day.isFriday && "bg-blue-50/50"
          )}>
            <td className="border-r border-gray-200 p-3 align-top">
              <div className="text-sm font-medium">{day.name}</div>
              <div className="text-xs text-gray-500">{day.date}</div>
              {day.weekNumber && (
                <div className="mt-1">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
                    Week {day.weekNumber}
                  </span>
                </div>
              )}
              {isSameDay(day.fullDate, today) && (
                <div className="mt-1">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-500 text-white">
                    Today
                  </span>
                </div>
              )}
            </td>
            
            {visibleTracks.map(track => (
              <td 
                key={`${day.id}-${track.id}`} 
                className="border-r border-gray-200 p-2 align-top"
              >
                <div className="space-y-2">
                  {getSessionsForCell(day.id, track.id).map(session => (
                    <div 
                      key={session.id}
                      className={cn(
                        "cursor-pointer",
                        hasConflict(session) && "border-l-4 border-red-500"
                      )}
                      onClick={() => onEditSession(session.id)}
                    >
                      <SessionCard 
                        title={session.title}
                        instructor={session.instructor}
                        type={session.type}
                        time={session.time}
                        customStartTime={session.customStartTime}
                        customEndTime={session.customEndTime}
                        count={session.count}
                        total={session.total}
                      />
                    </div>
                  ))}
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-center text-gray-400 hover:text-gray-700"
                        onClick={() => handleOpenAddSession(day.id, track.id)}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="ml-1 text-xs">Add Session</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72" align="center">
                      <AddSessionForm 
                        onSubmit={(sessionData) => onAddSession(day.id, track.id, sessionData)}
                        occupiedTimeSlots={selectedDayId === day.id && selectedTrackId === track.id 
                          ? getOccupiedTimeSlots(day.id, track.id) 
                          : []}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScheduleGridTable;
