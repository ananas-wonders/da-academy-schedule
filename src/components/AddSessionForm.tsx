
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SessionCardProps, SessionType, SessionTime } from './SessionCard';
import { Day, Track } from './ScheduleGrid';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

interface AddSessionFormProps {
  day: Day;
  track: Track;
  onAddSession: (session: Omit<SessionCardProps, 'id'>) => void;
}

interface Course {
  id: string;
  title: string;
  trackId: string;
}

interface Instructor {
  id: string;
  name: string;
}

// Mock fetch functions for courses and instructors - these would be replaced with real API calls
const fetchCourses = async (): Promise<Course[]> => {
  // This would be a real API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem('courses') || '[]'));
    }, 300);
  });
};

const fetchInstructors = async (): Promise<Instructor[]> => {
  // This would be a real API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem('instructors') || '[]'));
    }, 300);
  });
};

const AddSessionForm: React.FC<AddSessionFormProps> = ({ day, track, onAddSession }) => {
  const [courseId, setCourseId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [type, setType] = useState<SessionType>('online');
  const [time, setTime] = useState<SessionTime>('9am-12pm');
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(10);

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const { data: instructors = [] } = useQuery({
    queryKey: ['instructors'],
    queryFn: fetchInstructors,
  });

  // Filter courses by current track
  const filteredCourses = courses.filter(course => course.trackId === track.id);
  
  const selectedCourse = courses.find(course => course.id === courseId);
  const selectedInstructor = instructors.find(instructor => instructor.id === instructorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!courseId || !instructorId || count > total) {
      return; // Simple validation
    }
    
    onAddSession({
      title: selectedCourse?.title || '',
      instructor: selectedInstructor?.name || '',
      type,
      count,
      total,
      time,
      customStartTime: time === 'custom' ? customStartTime : undefined,
      customEndTime: time === 'custom' ? customEndTime : undefined
    });
    
    // Reset form
    setCourseId('');
    setInstructorId('');
    setType('online');
    setTime('9am-12pm');
    setCount(0);
    setTotal(10);
    setCustomStartTime('');
    setCustomEndTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm mb-3">
        <div className="font-semibold">Adding session for:</div>
        <div>{day.name} ({day.date}) - {track.name}</div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger id="course">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
              ))
            ) : (
              <SelectItem value="no-courses" disabled>No courses for this track</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instructor">Instructor</Label>
        <Select value={instructorId} onValueChange={setInstructorId}>
          <SelectTrigger id="instructor">
            <SelectValue placeholder="Select an instructor" />
          </SelectTrigger>
          <SelectContent>
            {instructors.map(instructor => (
              <SelectItem key={instructor.id} value={instructor.id}>{instructor.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Session Type</Label>
        <RadioGroup 
          value={type} 
          onValueChange={(value) => setType(value as SessionType)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">🌐 Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline" />
            <Label htmlFor="offline">🏫 Offline</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Session Time</Label>
        <RadioGroup 
          value={time} 
          onValueChange={(value) => setTime(value as SessionTime)}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="9am-12pm" id="morning" />
            <Label htmlFor="morning">9am - 12pm</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1pm-3:45pm" id="afternoon" />
            <Label htmlFor="afternoon">1pm - 3:45pm</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4pm-6:45pm" id="evening" />
            <Label htmlFor="evening">4pm - 6:45pm</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Custom</Label>
          </div>
        </RadioGroup>
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
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="count">Current Count</Label>
          <Input
            id="count"
            type="number"
            min={0}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total">Total Capacity</Label>
          <Input
            id="total"
            type="number"
            min={1}
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">Add Session</Button>
    </form>
  );
};

export default AddSessionForm;
