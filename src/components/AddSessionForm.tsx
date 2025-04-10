
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SessionCardProps, SessionType } from './SessionCard';
import { Day, Track } from './ScheduleGrid';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddSessionFormProps {
  day: Day;
  track: Track;
  onAddSession: (session: Omit<SessionCardProps, 'id'>) => void;
}

const AddSessionForm: React.FC<AddSessionFormProps> = ({ day, track, onAddSession }) => {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [type, setType] = useState<SessionType>('online');
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !instructor || count > total) {
      return; // Simple validation
    }
    
    onAddSession({
      title,
      instructor,
      type,
      count,
      total
    });
    
    // Reset form
    setTitle('');
    setInstructor('');
    setType('online');
    setCount(0);
    setTotal(10);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm mb-3">
        <div className="font-semibold">Adding session for:</div>
        <div>{day.name} ({day.date}) - {track.name}</div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Session Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter session title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instructor">Instructor</Label>
        <Input
          id="instructor"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          placeholder="Enter instructor name"
          required
        />
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
            <Label htmlFor="online">Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline" />
            <Label htmlFor="offline">Offline</Label>
          </div>
        </RadioGroup>
      </div>
      
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
