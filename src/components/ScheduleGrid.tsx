
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SessionCard, { SessionCardProps, SessionType } from './SessionCard';
import { cn } from '@/lib/utils';
import { Edit, GripHorizontal, Plus, FolderPlus, Settings, Eye, EyeOff, Palette } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddSessionForm from './AddSessionForm';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface Track {
  id: string;
  name: string;
  groupId?: string;
}

export interface TrackGroup {
  id: string;
  name: string;
  color?: string;
  visible?: boolean;
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
  groupColor = '#e2e8f0',
  grouped = false
}: { 
  track: Track; 
  onEditName: (id: string, name: string) => void;
  groupName?: string;
  groupColor?: string;
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
    ...(grouped ? { borderTop: `3px solid ${groupColor}` } : {})
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
        <div className="text-xs text-gray-500 mb-1" style={{ color: groupColor }}>{groupName}</div>
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

const EditSessionDialog = ({ 
  session, 
  onSave, 
  open, 
  onOpenChange 
}: { 
  session: Session | null, 
  onSave: (updatedSession: Session) => void,
  open: boolean,
  onOpenChange: (open: boolean) => void
}) => {
  const [editedSession, setEditedSession] = useState<Session | null>(null);

  React.useEffect(() => {
    if (session) {
      setEditedSession({ ...session });
    }
  }, [session]);

  if (!editedSession) return null;

  const handleChange = (field: keyof Session, value: any) => {
    setEditedSession(prev => ({ ...prev!, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedSession);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Session Title</Label>
            <Input
              id="edit-title"
              value={editedSession.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-instructor">Instructor</Label>
            <Input
              id="edit-instructor"
              value={editedSession.instructor}
              onChange={(e) => handleChange('instructor', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Session Type</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="edit-type-online"
                  checked={editedSession.type === 'online'}
                  onChange={() => handleChange('type', 'online')}
                />
                <Label htmlFor="edit-type-online">Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="edit-type-offline"
                  checked={editedSession.type === 'offline'}
                  onChange={() => handleChange('type', 'offline')}
                />
                <Label htmlFor="edit-type-offline">Offline</Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-count">Current Count</Label>
              <Input
                id="edit-count"
                type="number"
                min={0}
                value={editedSession.count}
                onChange={(e) => handleChange('count', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-total">Total Capacity</Label>
              <Input
                id="edit-total"
                type="number"
                min={1}
                value={editedSession.total}
                onChange={(e) => handleChange('total', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GroupSettings = ({ 
  groups,
  onUpdateGroups,
  onToggleGroupVisibility
}: { 
  groups: TrackGroup[],
  onUpdateGroups: (updatedGroups: TrackGroup[]) => void,
  onToggleGroupVisibility: (groupId: string, visible: boolean) => void
}) => {
  const [editingGroups, setEditingGroups] = useState<TrackGroup[]>([...groups]);
  
  const handleUpdateGroup = (index: number, field: keyof TrackGroup, value: any) => {
    const newGroups = [...editingGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setEditingGroups(newGroups);
  };
  
  const handleSave = () => {
    onUpdateGroups(editingGroups);
  };
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Manage Track Groups</h3>
      
      <div className="space-y-4">
        {editingGroups.map((group, index) => (
          <div key={group.id} className="flex flex-col space-y-2 p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`visible-${group.id}`}
                  checked={group.visible !== false}
                  onChange={(e) => onToggleGroupVisibility(group.id, e.target.checked)}
                />
                <Label htmlFor={`visible-${group.id}`} className="cursor-pointer">
                  {group.visible !== false ? 
                    <Eye className="h-4 w-4" /> : 
                    <EyeOff className="h-4 w-4" />
                  }
                </Label>
              </div>
              <input
                type="color"
                value={group.color || '#e2e8f0'}
                onChange={(e) => handleUpdateGroup(index, 'color', e.target.value)}
                className="w-8 h-8 p-0 rounded cursor-pointer"
                title="Select group color"
              />
            </div>
            <Input
              value={group.name}
              onChange={(e) => handleUpdateGroup(index, 'name', e.target.value)}
              placeholder="Group name"
            />
          </div>
        ))}
      </div>
      
      <Button onClick={handleSave} className="w-full">Save Changes</Button>
    </div>
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
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Filter visible tracks based on their group visibility
  const visibleTracks = tracks.filter(track => {
    if (!track.groupId) return true;
    const group = groups.find(g => g.id === track.groupId);
    return group ? group.visible !== false : true;
  });

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
    setGroups([...groups, { 
      id: newGroupId, 
      name: newGroupName,
      color: getRandomColor(),
      visible: true
    }]);
    
    // Update selected tracks to be part of this group
    setTracks(tracks.map(track => 
      selectedTracks.includes(track.id) ? { ...track, groupId: newGroupId } : track
    ));
    
    setNewGroupName('');
    setSelectedTracks([]);
    
    toast({
      title: "Track group created",
      description: `"${newGroupName}" group has been created with the selected tracks`,
    });
  };

  const handleUpdateGroups = (updatedGroups: TrackGroup[]) => {
    setGroups(updatedGroups);
    
    toast({
      title: "Groups updated",
      description: "Track groups have been successfully updated",
    });
  };

  const handleToggleGroupVisibility = (groupId: string, visible: boolean) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, visible } : group
    ));
    
    toast({
      title: visible ? "Group shown" : "Group hidden",
      description: `Group is now ${visible ? 'visible' : 'hidden'} in the schedule`,
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

  const handleEditSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setEditingSession(session);
      setSessionDialogOpen(true);
    }
  };

  const handleSaveEditedSession = (updatedSession: Session) => {
    setSessions(sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
    
    toast({
      title: "Session updated",
      description: `The session "${updatedSession.title}" has been updated`,
    });
  };

  const getRandomColor = () => {
    const colors = [
      '#f87171', '#fb923c', '#fbbf24', '#a3e635', 
      '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', 
      '#c084fc', '#e879f9', '#fb7185'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Get group for a track
  const getTrackGroup = (track: Track) => {
    if (!track.groupId) return null;
    return groups.find(g => g.id === track.groupId) || null;
  };

  // Flatten the grouped tracks for rendering
  const trackIds = visibleTracks.map(track => track.id);

  return (
    <div className="overflow-x-auto">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-end mb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" /> Group Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Track Group Settings</SheetTitle>
                <SheetDescription>
                  Manage your track groups, colors, and visibility
                </SheetDescription>
              </SheetHeader>
              <GroupSettings 
                groups={groups} 
                onUpdateGroups={handleUpdateGroups}
                onToggleGroupVisibility={handleToggleGroupVisibility}
              />
            </SheetContent>
          </Sheet>
        </div>

        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="w-[180px] bg-gray-50 p-3 font-semibold text-left border-b border-r border-gray-200"></th>
              <SortableContext items={trackIds} strategy={horizontalListSortingStrategy}>
                {visibleTracks.map(track => {
                  const group = getTrackGroup(track);
                  return (
                    <SortableTrack 
                      key={track.id} 
                      track={track} 
                      onEditName={handleEditTrackName}
                      groupName={group?.name}
                      groupColor={group?.color}
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
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium">Select Tracks</p>
                            <div className="flex items-center text-xs">
                              <Checkbox 
                                id="select-all"
                                checked={selectedTracks.length === tracks.length}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTracks(tracks.map(t => t.id));
                                  } else {
                                    setSelectedTracks([]);
                                  }
                                }}
                              />
                              <label htmlFor="select-all" className="ml-2">Select All</label>
                            </div>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {tracks.map(track => (
                              <div key={track.id} className="flex items-center">
                                <Checkbox 
                                  id={`track-${track.id}`}
                                  checked={selectedTracks.includes(track.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedTracks([...selectedTracks, track.id]);
                                    } else {
                                      setSelectedTracks(selectedTracks.filter(id => id !== track.id));
                                    }
                                  }}
                                />
                                <label htmlFor={`track-${track.id}`} className="ml-2">{track.name}</label>
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
                {visibleTracks.map(track => {
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
                        <div key={session.id} className="relative group">
                          <div 
                            className="absolute inset-0 bg-transparent group-hover:bg-black/5 rounded-md z-0 cursor-pointer"
                            onClick={() => handleEditSession(session.id)}
                          />
                          <SessionCard
                            title={session.title}
                            instructor={session.instructor}
                            type={session.type}
                            count={session.count}
                            total={session.total}
                          />
                        </div>
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
      
      <EditSessionDialog
        session={editingSession}
        onSave={handleSaveEditedSession}
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
      />
    </div>
  );
};

export default ScheduleGrid;
