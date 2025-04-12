
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SessionCard, { SessionCardProps, SessionType, SessionTime } from './SessionCard';
import { cn } from '@/lib/utils';
import { Edit, GripHorizontal, Plus, FolderPlus, Settings, Eye, EyeOff, Palette, ChevronLeft, ChevronRight, Calendar, Search, MessageCircle } from 'lucide-react';
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
  fullDate: Date;
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

  React.useEffect(() => {
    // Generate days based on the current month and view density
    const today = new Date();
    generateDays(currentMonth);
  }, [currentMonth, viewDensity, showMultipleMonths]);

  const generateDays = (baseDate: Date) => {
    const start = startOfMonth(baseDate);
    let end;
    
    if (showMultipleMonths) {
      // Show 2 months if showMultipleMonths is enabled
      end = endOfMonth(addMonths(start, 1));
    } else {
      end = endOfMonth(start);
    }

    const daysArray = eachDayOfInterval({ start, end });
    
    const formattedDays: Day[] = daysArray.map(day => ({
      id: format(day, 'yyyy-MM-dd'),
      name: format(day, 'EEEE'),
      date: format(day, 'MMM d, yyyy'),
      fullDate: day,
      isFriday: isFriday(day)
    }));

    setDays(formattedDays);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(prev => setMonth(prev, month));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(prev => setYear(prev, year));
  };

  const visibleTracks = tracks.filter(track => {
    if (!track.groupId) return true;
    const group = groups.find(g => g.id === track.groupId);
    return group ? group.visible !== false : true;
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

  const getTrackGroup = (track: Track) => {
    if (!track.groupId) return null;
    return groups.find(g => g.id === track.groupId) || null;
  };

  const trackIds = visibleTracks.map(track => track.id);
  const today = new Date();
  const currentMonthYearString = format(currentMonth, 'MMMM yyyy');

  // Generate years for selector (current year +/- 10 years)
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="overflow-x-auto">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-between mb-3 items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[200px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  {currentMonthYearString}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <div className="flex justify-between mb-3">
                    <Select 
                      value={String(getMonth(currentMonth))} 
                      onValueChange={(value) => handleMonthChange(Number(value))}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {format(new Date(2000, i, 1), 'MMMM')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={String(getYear(currentMonth))} 
                      onValueChange={(value) => handleYearChange(Number(value))}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <CalendarComponent
                    mode="single"
                    selected={currentMonth}
                    onSelect={(date) => {
                      if (date) {
                        setCurrentMonth(date);
                        setIsDatePickerOpen(false);
                      }
                    }}
                    className="rounded-md border"
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant={showMultipleMonths ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMultipleMonths(!showMultipleMonths)}
              className="ml-2"
            >
              {showMultipleMonths ? "Single Month" : "Multiple Months"}
            </Button>
          </div>
          
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
            {days.map(day => {
              const isToday = isSameDay(day.fullDate, today);
              return (
                <tr key={day.id} className={cn(
                  day.isFriday ? "bg-gray-100" : "",
                  isToday ? "bg-yellow-50" : ""
                )}>
                  <td className={cn(
                    "w-[180px] bg-gray-50 p-3 font-medium text-left border-b border-r border-gray-200 sticky left-0",
                    day.isFriday ? "bg-gray-200" : "",
                    isToday ? "bg-yellow-100" : ""
                  )}>
                    <div className="font-semibold">{day.name}</div>
                    <div className={cn("text-xs", isToday ? "font-bold text-blue-600" : "text-gray-500")}>
                      {day.date} {isToday && "👈 Today"}
                    </div>
                  </td>
                  {visibleTracks.map(track => {
                    const cellSessions = getSessionsForCell(day.id, track.id);
                    return (
                      <td 
                        key={`${day.id}-${track.id}`} 
                        className={cn(
                          "min-w-[250px] p-2 border-b border-r border-gray-200 align-top",
                          day.isFriday ? "bg-gray-100" : "",
                          isToday ? "bg-yellow-50" : ""
                        )}
                      >
                        {cellSessions.map(session => {
                          const hasSessionConflict = hasConflict(session);
                          return (
                            <div key={session.id} className="relative group">
                              <div 
                                className="absolute inset-0 bg-transparent group-hover:bg-black/5 rounded-md z-0 cursor-pointer"
                                onClick={() => handleEditSession(session.id)}
                              />
                              <div className={cn(
                                "mb-2",
                                hasSessionConflict ? "ring-2 ring-pink-400 rounded-md" : ""
                              )}>
                                <SessionCard
                                  title={session.title}
                                  instructor={session.instructor}
                                  type={session.type}
                                  count={session.count}
                                  total={session.total}
                                  time={session.time}
                                  customStartTime={session.customStartTime}
                                  customEndTime={session.customEndTime}
                                />
                              </div>
                            </div>
                          );
                        })}
                        
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
              );
            })}
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
