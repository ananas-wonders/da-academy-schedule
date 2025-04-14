
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SessionCardProps, SessionType, SessionTime } from './SessionCard';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimeSlot } from '@/hooks/useSessionOverlap';
import { Badge } from "@/components/ui/badge";

interface AddSessionFormProps {
  onSubmit: (sessionData: Omit<SessionCardProps, 'id'>) => void;
  occupiedTimeSlots?: TimeSlot[];
}

interface Course {
  id: string;
  title: string;
  trackId: string;
  lectureHours: number;
  labHours: number;
  selfStudyHours: number;
  totalHours: number;
  numberOfSessions: number;
}

interface Instructor {
  id: string;
  name: string;
  phone: string;
}

// Mock fetch functions for courses and instructors
const fetchCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem('courses') || '[]'));
    }, 300);
  });
};

const fetchInstructors = async (): Promise<Instructor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem('instructors') || '[]'));
    }, 300);
  });
};

const AddSessionForm: React.FC<AddSessionFormProps> = ({ onSubmit, occupiedTimeSlots = [] }) => {
  const [courseId, setCourseId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [type, setType] = useState<SessionType>('online');
  const [time, setTime] = useState<SessionTime>('9am-12pm');
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [courseOpen, setCourseOpen] = useState(false);
  const [instructorOpen, setInstructorOpen] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const { data: instructors = [] } = useQuery({
    queryKey: ['instructors'],
    queryFn: fetchInstructors,
  });

  // Filter courses
  const filteredCourses = courses;
  
  const selectedCourse = courses.find(course => course.id === courseId);
  const selectedInstructor = instructors.find(instructor => instructor.id === instructorId);

  // Check if a time slot is occupied
  const isTimeSlotOccupied = (timeValue: string): boolean => {
    if (!occupiedTimeSlots || occupiedTimeSlots.length === 0) return false;
    
    if (timeValue === 'custom') {
      // For custom time slots, we'll check this separately
      return false;
    }
    
    return occupiedTimeSlots.some(slot => {
      const slotString = `${slot.startTime}-${slot.endTime}`;
      return slotString === timeValue;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!courseId || !instructorId) {
      return; // Simple validation
    }
    
    onSubmit({
      title: selectedCourse?.title || '',
      instructor: selectedInstructor?.name || '',
      type,
      count: 0, // We'll calculate this automatically later
      total: 10, // We'll calculate this automatically later
      time,
      customStartTime: time === 'custom' ? customStartTime : undefined,
      customEndTime: time === 'custom' ? customEndTime : undefined
    });
    
    // Reset form
    setCourseId('');
    setInstructorId('');
    setType('online');
    setTime('9am-12pm');
    setCustomStartTime('');
    setCustomEndTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Popover open={courseOpen} onOpenChange={setCourseOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={courseOpen}
              className="w-full justify-between"
            >
              {courseId
                ? filteredCourses.find((course) => course.id === courseId)?.title
                : "Select a course..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search courses..." className="h-9" />
              <CommandList>
                <CommandEmpty>No courses found.</CommandEmpty>
                <CommandGroup>
                  {filteredCourses.map((course) => (
                    <CommandItem
                      key={course.id}
                      value={course.id}
                      onSelect={(currentValue) => {
                        setCourseId(currentValue);
                        setCourseOpen(false);
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
        <Label htmlFor="instructor">Instructor</Label>
        <Popover open={instructorOpen} onOpenChange={setInstructorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={instructorOpen}
              className="w-full justify-between"
            >
              {instructorId
                ? instructors.find((instructor) => instructor.id === instructorId)?.name
                : "Select an instructor..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search instructors..." className="h-9" />
              <CommandList>
                <CommandEmpty>No instructors found.</CommandEmpty>
                <CommandGroup>
                  {instructors.map((instructor) => (
                    <CommandItem
                      key={instructor.id}
                      value={instructor.id}
                      onSelect={(currentValue) => {
                        setInstructorId(currentValue);
                        setInstructorOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{instructor.name}</span>
                        {instructor.phone && (
                          <a 
                            href={`https://api.whatsapp.com/send?phone=${instructor.phone.replace(/\D/g, '')}`}
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
          value={type} 
          onValueChange={(value) => value && setType(value as SessionType)}
          className="flex justify-start"
        >
          <ToggleGroupItem value="online" aria-label="Online" className="rounded-full">
            🌐 Online
          </ToggleGroupItem>
          <ToggleGroupItem value="offline" aria-label="Offline" className="rounded-full">
            🏫 Offline
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Session Time</Label>
        <ToggleGroup 
          type="single" 
          value={time} 
          onValueChange={(value) => value && setTime(value as SessionTime)}
          className="flex flex-wrap justify-start gap-2"
        >
          {["9am-12pm", "1pm-3:45pm", "4pm-6:45pm", "custom"].map((timeValue) => {
            const occupied = isTimeSlotOccupied(timeValue);
            const displayText = timeValue === "custom" ? "Custom" : timeValue;
            
            return (
              <ToggleGroupItem 
                key={timeValue}
                value={timeValue} 
                aria-label={displayText} 
                className="rounded-full relative"
                disabled={occupied}
              >
                <span className={occupied ? "text-gray-400" : ""}>
                  {displayText}
                </span>
                {occupied && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs bg-gray-200">
                    Occupied
                  </Badge>
                )}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
      
      {time === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={customStartTime}
              onChange={(e) => setCustomStartTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={customEndTime}
              onChange={(e) => setCustomEndTime(e.target.value)}
              required
            />
          </div>
        </div>
      )}
      
      <Button type="submit" className="w-full">Add Session</Button>
    </form>
  );
};

export default AddSessionForm;
