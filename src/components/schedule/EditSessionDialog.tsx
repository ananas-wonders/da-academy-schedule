
import React, { useState, useEffect } from 'react';
import { Trash2, Check, Search, MessageCircle, AlertCircle } from 'lucide-react';
import { Session } from '@/types/schedule';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { SessionType, SessionTime } from '@/components/SessionCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSessionOverlap } from '@/hooks/useSessionOverlap';

interface EditSessionDialogProps {
  session: Session | null;
  onSave: (updatedSession: Session) => void;
  onDelete?: (sessionId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allSessions: Session[];
}

const EditSessionDialog: React.FC<EditSessionDialogProps> = ({ 
  session, 
  onSave, 
  onDelete,
  open, 
  onOpenChange,
  allSessions
}) => {
  const [editedSession, setEditedSession] = useState<Session | null>(null);
  const [courseSearchValue, setCourseSearchValue] = useState('');
  const [instructorSearchValue, setInstructorSearchValue] = useState('');
  const [isOpenCourses, setIsOpenCourses] = useState(false);
  const [isOpenInstructors, setIsOpenInstructors] = useState(false);
  const [courseOptions, setCourseOptions] = useState<{ id: string, title: string }[]>([]);
  const [instructorOptions, setInstructorOptions] = useState<{ id: string, name: string, phone?: string }[]>([]);
  const [hasOverlap, setHasOverlap] = useState(false);
  
  const { checkSessionOverlap } = useSessionOverlap(allSessions || []);

  useEffect(() => {
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

  useEffect(() => {
    if (session) {
      setEditedSession({ ...session });
      
      // Check for overlaps immediately when editing an existing session
      if (allSessions && allSessions.length > 0) {
        const hasTimeConflict = checkSessionOverlap(session, session.id);
        setHasOverlap(hasTimeConflict);
      }
    }
  }, [session, allSessions, checkSessionOverlap]);

  const checkForOverlaps = (updatedSession: Session) => {
    if (!allSessions || allSessions.length === 0) return false;
    
    const hasTimeConflict = checkSessionOverlap(
      updatedSession, 
      session ? session.id : undefined
    );
    
    setHasOverlap(hasTimeConflict);
    return hasTimeConflict;
  };

  if (!editedSession) return null;

  const handleChange = (field: keyof Session, value: any) => {
    const updatedSession = { ...editedSession, [field]: value };
    setEditedSession(updatedSession);
    
    // Check for overlaps when changing instructor or time
    if (field === 'instructor' || field === 'time' || field === 'customStartTime' || field === 'customEndTime') {
      checkForOverlaps(updatedSession);
    }
  };

  const handleSave = () => {
    // Final overlap check before saving
    const hasConflict = checkForOverlaps(editedSession);
    
    if (hasConflict) {
      // Don't save if there's an overlap
      return;
    }
    
    onSave(editedSession);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete && editedSession.id) {
      onDelete(editedSession.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-count">Current Count</Label>
              <Input
                id="edit-count"
                type="number"
                value={editedSession.count || 0}
                onChange={(e) => handleChange('count', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-total">Total Sessions</Label>
              <Input
                id="edit-total"
                type="number"
                value={editedSession.total || 0}
                onChange={(e) => handleChange('total', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          {hasOverlap && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This instructor already has a session scheduled at this time. 
                Please select a different time or instructor.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            type="button"
            className="flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Session
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button 
              onClick={handleSave} 
              disabled={hasOverlap}
              variant={hasOverlap ? "outline" : "default"}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSessionDialog;
