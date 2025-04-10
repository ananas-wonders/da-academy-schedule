
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SessionCard, { SessionCardProps } from './SessionCard';
import { cn } from '@/lib/utils';
import { Edit, GripHorizontal, Plus, Folder, FolderPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddSessionForm from './AddSessionForm';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface Track {
  id: string;
  name: string;
  groupId?: string;
}

export interface TrackGroup {
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

// SortableTrack component for drag and drop
const SortableTrack = ({ 
  track, 
  onEditName, 
  groupName,
  grouped = false
}: { 
  track: Track; 
  onEditName: (id: string, name: string) => void;
  groupName?: string;
  grouped?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(track.name);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: track.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveName = () => {
    onEditName(track.id, name);
    setIsEditing(false);
  };

  return (
    <th 
      ref={setNodeRef} 
      style={style} 
      className="min-w-[250px] bg-gray-50 p-3 font-semibold text-center border-b border-r border-gray-200 relative"
    >
      {grouped && (
        <div className="text-xs text-gray-500 mb-1">{groupName}</div>
      )}
      
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="h-8"
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          />
          <Button size="sm" onClick={handleSaveName}>Save</Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>{track.name}</span>
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            title="Edit track name"
          >
            <Edit size={14} />
          </button>
          <button 
            {...attributes} 
            {...listeners}
            className="p-1 cursor-move rounded-full hover:bg-gray-200 transition-colors"
            title="Drag to reorder"
          >
            <GripHorizontal size={14} />
          </button>
        </div>
      )}
    </th>
  );
};

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  days, 
  tracks: initialTracks, 
  sessions: initialSessions,
  viewDensity
}) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [groups, setGroups] = useState<TrackGroup[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Function to get sessions for a specific day and track
  const getSessionsForCell = (dayId: string, trackId: string) => {
    return sessions.filter(
      session => session.dayId === dayId && session.trackId === trackId
    ).slice(0, 5); // Limit to 5 cards per cell
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTracks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });

      toast({
        title: "Track order updated",
        description: "The track order has been successfully updated",
      });
    }
  };

  const handleEditTrackName = (id: string, newName: string) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, name: newName } : track
    ));

    toast({
      title: "Track renamed",
      description: `Track has been renamed to "${newName}"`,
    });
  };

  const handleAddTrack = () => {
    const newId = `track-${Date.now()}`;
    setTracks([...tracks, { id: newId, name: `New Track ${tracks.length + 1}` }]);
    
    toast({
      title: "Track added",
      description: "A new track has been added to the schedule",
    });
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroupId = `group-${Date.now()}`;
    setGroups([...groups, { id: newGroupId, name: newGroupName }]);
    
    // Update selected tracks to be part of this group
    setTracks(tracks.map(track => 
      selectedTracks.includes(track.id) ? { ...track, groupId: newGroupId } : track
    ));
    
    setNewGroupName('');
    setSelectedTracks([]);
    setShowGroupModal(false);
    
    toast({
      title: "Track group created",
      description: `"${newGroupName}" group has been created with the selected tracks`,
    });
  };

  const handleAddSession = (dayId: string, trackId: string, newSession: Omit<SessionCardProps, 'id'>) => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const session: Session = {
      id: sessionId,
      dayId,
      trackId,
      ...newSession
    };
    
    setSessions([...sessions, session]);
    
    toast({
      title: "Session added",
      description: `A new session "${newSession.title}" has been added to the schedule`,
    });
  };

  // Group tracks by their groupId
  const groupedTracks = tracks.reduce((acc, track) => {
    if (track.groupId) {
      const group = groups.find(g => g.id === track.groupId);
      if (group) {
        const groupName = group.name;
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(track);
      } else {
        if (!acc['Ungrouped']) acc['Ungrouped'] = [];
        acc['Ungrouped'].push(track);
      }
    } else {
      if (!acc['Ungrouped']) acc['Ungrouped'] = [];
      acc['Ungrouped'].push(track);
    }
    return acc;
  }, {} as Record<string, Track[]>);

  // Flatten the grouped tracks for rendering
  const trackIds = tracks.map(track => track.id);

  return (
    <div className="overflow-x-auto">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="w-[180px] bg-gray-50 p-3 font-semibold text-left border-b border-r border-gray-200"></th>
              <SortableContext items={trackIds} strategy={horizontalListSortingStrategy}>
                {tracks.map(track => {
                  const group = track.groupId ? groups.find(g => g.id === track.groupId) : undefined;
                  return (
                    <SortableTrack 
                      key={track.id} 
                      track={track} 
                      onEditName={handleEditTrackName}
                      groupName={group?.name}
                      grouped={!!track.groupId}
                    />
                  );
                })}
              </SortableContext>
              <th className="w-[50px] bg-gray-50 p-3 border-b border-r border-gray-200">
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleAddTrack} 
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors mx-auto"
                    title="Add new track"
                  >
                    <Plus size={20} />
                  </button>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <button 
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors mx-auto"
                        title="Create track group"
                      >
                        <FolderPlus size={20} />
                      </button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Create Track Group</SheetTitle>
                        <SheetDescription>
                          Create a new group to organize related tracks together.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <div className="mb-4">
                          <label className="text-sm font-medium" htmlFor="group-name">Group Name</label>
                          <Input 
                            id="group-name"
                            value={newGroupName} 
                            onChange={(e) => setNewGroupName(e.target.value)} 
                            placeholder="Enter group name"
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Select Tracks</p>
                          <div className="space-y-2">
                            {tracks.map(track => (
                              <div key={track.id} className="flex items-center">
                                <input 
                                  type="checkbox"
                                  id={`track-${track.id}`}
                                  checked={selectedTracks.includes(track.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedTracks([...selectedTracks, track.id]);
                                    } else {
                                      setSelectedTracks(selectedTracks.filter(id => id !== track.id));
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor={`track-${track.id}`}>{track.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button onClick={handleCreateGroup}>Create Group</Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </th>
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
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <button 
                            className="w-full mt-2 p-1 border border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition-colors text-xs flex items-center justify-center"
                          >
                            <Plus size={12} className="mr-1" /> Add Session
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <AddSessionForm 
                            day={day} 
                            track={track} 
                            onAddSession={(sessionData) => handleAddSession(day.id, track.id, sessionData)} 
                          />
                        </PopoverContent>
                      </Popover>
                    </td>
                  );
                })}
                <td className="w-[50px] border-b border-r border-gray-200"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
};

export default ScheduleGrid;
