import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SessionCard, { SessionCardProps, SessionType, SessionTime } from './SessionCard';
import { cn } from '@/lib/utils';
import { Edit, GripHorizontal, Plus, FolderPlus, Settings, Eye, EyeOff, Palette, ChevronLeft, ChevronRight, Calendar, Search, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddSessionForm from './AddSessionForm';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isFriday, addMonths, subMonths, setMonth, setYear, getMonth, getYear } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export interface Track {
  id: string;
  name: string;
  groupId?: string;
  visible?: boolean;
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
  fullDate: Date;
  isFriday?: boolean;
}

export interface Session extends SessionCardProps {
  id: string;
  dayId: string;
  trackId: string;
}

export type ViewDensity = '1week' | '2weeks' | 'month' | '2months' | 'week' | 'custom';

interface ScheduleGridProps {
  days: Day[];
  tracks: Track[];
  sessions: Session[];
  viewDensity: ViewDensity;
}

const SortableTrack = ({ 
  track, 
  onEditName, 
  groupName,
  groupColor = '#e2e8f0',
  grouped = false,
  onToggleVisibility,
  onCopyLink
}: { 
  track: Track; 
  onEditName: (id: string, name: string) => void;
  groupName?: string;
  groupColor?: string;
  grouped?: boolean;
  onToggleVisibility?: (id: string, visible: boolean) => void;
  onCopyLink?: (id: string, name: string) => void;
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
          <div className="flex items-center">
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
            
            {onToggleVisibility && (
              <button 
                onClick={() => onToggleVisibility(track.id, !(track.visible !== false))} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title={track.visible !== false ? "Hide track" : "Show track"}
              >
                {track.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            )}
            
            {onCopyLink && (
              <button 
                onClick={() => onCopyLink(track.id, track.name)} 
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Copy track link"
              >
                <LinkIcon size={14} />
              </button>
            )}
          </div>
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
  const [courseSearchValue, setCourseSearchValue] = useState('');
  const [instructorSearchValue, setInstructorSearchValue] = useState('');
  const [isOpenCourses, setIsOpenCourses] = useState(false);
  const [isOpenInstructors, setIsOpenInstructors] = useState(false);
  const [courseOptions, setCourseOptions] = useState<{ id: string, title: string }[]>([]);
  const [instructorOptions, setInstructorOptions] = useState<{ id: string, name: string, phone?: string }[]>([]);

  React.useEffect(() => {
    const loadData = () => {
      try {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const instructors = JSON.parse(localStorage.getItem('instructors') || '[]');
        setCourseOptions(courses.map((c: any) => ({ id: c.id, title: c.title })));
        setInstructorOptions(instructors.map((i: any) => ({ 
          id: i.id, 
          name: i.name,
          phone: i.phone 
        })));
      } catch (e) {
        console.error('Error loading data:', e);
      }
    };

    loadData();
  }, []);

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
            <Label htmlFor="edit-title">Course</Label>
            <Popover open={isOpenCourses} onOpenChange={setIsOpenCourses}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpenCourses}
                  className="w-full justify-between"
                >
                  {editedSession.title || "Select course..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search courses..." 
                    value={courseSearchValue}
                    onValueChange={setCourseSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No courses found.</CommandEmpty>
                    <CommandGroup>
                      {courseOptions
                        .filter(course => 
                          course.title.toLowerCase().includes(courseSearchValue.toLowerCase())
                        )
                        .map(course => (
                          <CommandItem
                            key={course.id}
                            value={course.title}
                            onSelect={() => {
                              handleChange('title', course.title);
                              setIsOpenCourses(false);
                            }}
                          >
                            {course.title}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-instructor">Instructor</Label>
            <Popover open={isOpenInstructors} onOpenChange={setIsOpenInstructors}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpenInstructors}
                  className="w-full justify-between"
                >
                  {editedSession.instructor || "Select instructor..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search instructors..." 
                    value={instructorSearchValue}
                    onValueChange={setInstructorSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No instructors found.</CommandEmpty>
                    <CommandGroup>
                      {instructorOptions
                        .filter(instructor => 
                          instructor.name.toLowerCase().includes(instructorSearchValue.toLowerCase())
                        )
                        .map(instructor => (
                          <CommandItem
                            key={instructor.id}
                            value={instructor.name}
                            onSelect={() => {
                              handleChange('instructor', instructor.name);
                              setIsOpenInstructors(false);
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{instructor.name}</span>
                              {instructor.phone && (
                                <a
                                  href={`https://api.whatsapp.com/send?phone=${instructor.phone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <MessageCircle size={16} />
                                </a>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Session Type</Label>
            <ToggleGroup 
              type="single" 
              value={editedSession.type} 
              onValueChange={(value: string) => {
                if (value) handleChange('type', value as SessionType);
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="online" className="px-4 data-[state=on]:bg-blue-100">
                🌐 Online
              </ToggleGroupItem>
              <ToggleGroupItem value="offline" className="px-4 data-[state=on]:bg-green-100">
                🏫 Offline
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label>Session Time</Label>
            <ToggleGroup 
              type="single" 
              value={editedSession.time || '9am-12pm'} 
              onValueChange={(value: string) => {
                if (value) handleChange('time', value as SessionTime);
              }}
              className="justify-start flex-wrap gap-2"
            >
              <ToggleGroupItem value="9am-12pm" className="data-[state=on]:bg-indigo-100">
                9am - 12pm
              </ToggleGroupItem>
              <ToggleGroupItem value="1pm-3:45pm" className="data-[state=on]:bg-indigo-100">
                1pm - 3:45pm
              </ToggleGroupItem>
              <ToggleGroupItem value="4pm-6:45pm" className="data-[state=on]:bg-indigo-100">
                4pm - 6:45pm
              </ToggleGroupItem>
              <ToggleGroupItem value="custom" className="data-[state=on]:bg-indigo-100">
                Custom
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {editedSession.time === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">Start Time</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={editedSession.customStartTime || ''}
                  onChange={(e) => handleChange('customStartTime', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endTime">End Time</Label>
                <Input
                  id="edit-endTime"
                  type="time"
                  value={editedSession.customEndTime || ''}
                  onChange={(e) => handleChange('customEndTime', e.target.value)}
                  required
                />
              </div>
            </div>
          )}
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
  days: initialDays, 
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [days, setDays] = useState<Day[]>(initialDays);
  const [showMultipleMonths, setShowMultipleMonths] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    // Set days from props
    setDays(initialDays);
    
    // Set tracks from props
    setTracks(initialTracks);
    
    // Set sessions from props
    setSessions(initialSessions);
    
    // Fetch track groups
    fetchTrackGroups();
  }, [initialDays, initialTracks, initialSessions]);

  const fetchTrackGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('track_groups')
        .select('*');
        
      if (error) throw error;
      
      setGroups(data.map(group => ({
        id: group.id,
        name: group.name,
        color: group.color,
        visible: group.visible
      })));
    } catch (error) {
      console.error('Error fetching track groups:', error);
    }
  };

  const visibleTracks = tracks.filter(track => {
    if (!track.groupId) return track.visible !== false;
    const group = groups.find(g => g.id === track.groupId);
    return group ? (group.visible !== false && track.visible !== false) : (track.visible !== false);
  });

  const getSessionsForCell = (dayId: string, trackId: string) => {
    return sessions.filter(
      session => session.dayId === dayId && session.trackId === trackId
    ).slice(0, 5);
  };

  // Check if a session conflicts with another session (same instructor, same day, different track)
  const hasConflict = (session: Session) => {
    return sessions.some(s => 
      s.id !== session.id && 
      s.dayId === session.dayId && 
      s.trackId !== session.trackId && 
      s.instructor === session.instructor &&
      s.time === session.time
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTracks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });

      // Update order in database (if needed in the future)

      toast({
        title: "Track order updated",
        description: "The track order has been successfully updated",
      });
    }
  };

  const handleEditTrackName = async (id: string, newName: string) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('tracks')
        .update({ name: newName })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTracks(tracks.map(track => 
        track.id === id ? { ...track, name: newName } : track
      ));

      toast({
        title: "Track renamed",
        description: `Track has been renamed to "${newName}"`,
      });
    } catch (error) {
      console.error('Error updating track name:', error);
      toast({
        variant: "destructive",
        title: "Error updating track",
        description: "Failed to update track name",
      });
    }
  };

  const handleAddTrack = async () => {
    try {
      const newId = `track-${Date.now()}`;
      const newName = `New Track ${tracks.length + 1}`;
      
      // Add to database
      const { error } = await supabase
        .from('tracks')
        .insert([{ id: newId, name: newName, visible: true }]);
        
      if (error) throw error;
      
      // Update local state
      setTracks([...tracks, { id: newId, name: newName, visible: true }]);
      
      toast({
        title: "Track added",
        description: "A new track has been added to the schedule",
      });
    } catch (error) {
      console.error('Error adding track:', error);
      toast({
        variant: "destructive",
        title: "Error adding track",
        description: "Failed to add new track",
      });
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const newGroupId = `group-${Date.now()}`;
      const newGroup = { 
        id: newGroupId, 
        name: newGroupName,
        color: getRandomColor(),
        visible: true
      };
      
      // Add group to database
      const { error: groupError } = await supabase
        .from('track_groups')
        .insert([newGroup]);
        
      if (groupError) throw groupError;
      
      // Update tracks with group assignment
      for (const trackId of selectedTracks) {
        const { error: trackError } = await supabase
          .from('tracks')
          .update({ group_id: newGroupId })
          .eq('id', trackId);
          
        if (trackError) throw trackError;
      }
      
      // Update local state
      setGroups([...groups, newGroup]);
      
      setTracks(tracks.map(track => 
        selectedTracks.includes(track.id) ? { ...track, groupId: newGroupId } : track
      ));
      
      setNewGroupName('');
      setSelectedTracks([]);
      
      toast({
        title: "Track group created",
        description: `"${newGroupName}" group has been created with the selected tracks`,
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        variant: "destructive",
        title: "Error creating group",
        description: "Failed to create track group",
      });
    }
  };

  const handleUpdateGroups = async (updatedGroups: TrackGroup[]) => {
    try {
      // Update each group in the database
      for (const group of updatedGroups) {
        const { error } = await supabase
          .from('track_groups')
          .update({ 
            name: group.name,
            color: group.color,
            visible: group.visible
          })
          .eq('id', group.id);
          
        if (error) throw error;
      }
      
      // Update local state
      setGroups(updatedGroups);
      
      toast({
        title: "Groups updated",
        description: "Track groups have been successfully updated",
      });
    } catch (error) {
      console.error('Error updating groups:', error);
      toast({
        variant: "destructive",
        title: "Error updating groups",
        description: "Failed to update track groups",
      });
    }
  };

  const handleToggleGroupVisibility = async (groupId: string, visible: boolean) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('track_groups')
        .update({ visible })
        .eq('id', groupId);
        
      if (error) throw error;
      
      // Update local state
      setGroups(groups.map(group => 
        group.id === groupId ? { ...group, visible } : group
      ));
      
      toast({
        title: visible ? "Group shown" : "Group hidden",
        description: `Group is now ${visible ? 'visible' : 'hidden'} in the schedule`,
      });
    } catch (error) {
      console.error('Error updating group visibility:', error);
      toast({
        variant: "destructive",
        title: "Error updating visibility",
        description: "Failed to update group visibility",
      });
    }
  };

  const handleToggleTrackVisibility = async (trackId: string, visible: boolean) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('tracks')
        .update({ visible })
        .eq('id', trackId);
        
      if (error) throw error;
      
      // Update local state
      setTracks(tracks.map(track => 
        track.id === trackId ? { ...track, visible } : track
      ));
      
      toast({
        title: visible ? "Track shown" : "Track hidden",
        description: `Track is now ${visible ? 'visible' : 'hidden'} in the schedule`,
      });
    } catch (error) {
      console.error('Error updating track visibility:', error);
      toast({
        variant: "destructive",
        title: "Error updating visibility",
        description: "Failed to update track visibility",
      });
    }
  };
  
  const handleCopyTrackLink = (trackId: string, trackName: string) => {
    const url = `${window.location.origin}/track/${trackId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: `Link to ${trackName} schedule has been copied to clipboard`,
      });
    }).catch(err => {
      console.error('Error copying text: ', err);
      toast({
        variant: "destructive",
        title: "Error copying link",
        description: "Failed to copy track link to clipboard",
      });
    });
  };

  const handleAddSession = async (dayId: string, trackId: string, newSession: Omit<SessionCardProps, 'id'>) => {
    try {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const session: Session = {
        id: sessionId,
        dayId,
        trackId,
        ...newSession
      };
      
      // Add to database
      const { error } = await supabase
        .from('sessions')
        .insert([{
          id: sessionId,
          day_id: dayId,
          track_id: trackId,
          title: newSession.title,
          instructor: newSession.instructor,
          type: newSession.type,
          time: newSession.time,
          custom_start_time: newSession.customStartTime,
          custom_end_time: newSession.customEndTime,
          count: newSession.count,
          total: newSession.total
        }]);
        
      if (error) throw error;
      
      // Update local state
      setSessions([...sessions, session]);
      
      toast({
        title: "Session added",
        description: `A new session "${newSession.title}" has been added to the schedule`,
      });
    } catch (error) {
      console.error('Error adding session:', error);
      toast({
        variant: "destructive",
        title: "Error adding session",
        description: "Failed to add new session",
      });
    }
  };

  const handleEditSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setEditingSession(session);
      setSessionDialogOpen(true);
    }
  };

  const handleSaveEditedSession = async (updatedSession: Session) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('sessions')
        .update({
          title: updatedSession.title,
          instructor: updatedSession.instructor,
          type: updatedSession.type,
          time: updatedSession.time,
          custom_start_time: updatedSession.customStartTime,
          custom_end_time: updatedSession.customEndTime,
          count: updatedSession.count,
          total: updatedSession.total
        })
        .eq('id', updatedSession.id);
        
      if (error) throw error;
      
      // Update local state
      setSessions(sessions.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      ));
      
      toast({
        title: "Session updated",
        description: `The session "${updatedSession.title}" has been updated`,
      });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        variant: "destructive",
        title: "Error updating session",
        description: "Failed to update session",
      });
    }
  };

  const getRandomColor = () => {
    const colors = [
      '#f87171', '#fb923c', '#fbbf24', '#a3e635', 
      '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', 
      '#c084fc', '#e879f9', '#fb7185'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getTrackGroup = (track: Track) => {
    if (!track.groupId) return null;
    return groups.find(g => g.id === track.groupId) || null;
  };

  const trackIds = visibleTracks.map(track => track.id);
  const today = new Date();

  return (
    <div className="overflow-x-auto">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-between mb-3 items-center">
          <div className="flex items-center gap-2">
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
                      onToggleVisibility={handleToggleTrackVisibility}
