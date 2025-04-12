
import React, { useState, useEffect } from 'react';
import ScheduleGrid, { ViewDensity, Track } from '@/components/ScheduleGrid';
import { sessions, Session } from '@/data/scheduleData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isFriday, addDays } from 'date-fns';

const Index = () => {
  const [viewDensity, setViewDensity] = useState<ViewDensity>('2weeks');
  const [tracks, setTracks] = useState<Track[]>([
    { id: 'track-1', name: 'Beginner Course' },
    { id: 'track-2', name: 'Intermediate' },
    { id: 'track-3', name: 'Advanced Course' },
    { id: 'track-4', name: 'Expert Racing' }
  ]);
  const [days, setDays] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate days based on the current month
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    
    const daysArray = eachDayOfInterval({ start, end });
    
    const generatedDays = daysArray.map(day => ({
      id: format(day, 'yyyy-MM-dd'),
      name: format(day, 'EEEE'),
      date: format(day, 'MMM d, yyyy'),
      fullDate: day,
      isFriday: isFriday(day)
    }));
    
    setDays(generatedDays);
  }, []);
  
  // Filter days based on selected view density
  const getVisibleDays = () => {
    if (!days.length) return [];
    
    switch (viewDensity) {
      case '1week':
        return days.slice(0, 7);
      case '2weeks':
        return days.slice(0, 14);
      case 'month':
        return days; // Full month
      case '2months':
        // For 2 months view, we'll extend days to include some days from next month
        if (days.length) {
          const lastDate = days[days.length - 1].fullDate;
          const additionalDays = eachDayOfInterval({ 
            start: addDays(lastDate, 1), 
            end: addDays(lastDate, 31) // Approximately one more month
          }).map(day => ({
            id: format(day, 'yyyy-MM-dd'),
            name: format(day, 'EEEE'),
            date: format(day, 'MMM d, yyyy'),
            fullDate: day,
            isFriday: isFriday(day)
          }));
          
          return [...days, ...additionalDays];
        }
        return days;
      default:
        return days.slice(0, 14); // Default to 2 weeks
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1600px] mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Digital Arts and Design Academy Schedule</h1>
        
        <div className="flex items-center gap-2">
          <label htmlFor="view-density" className="text-sm font-medium">View:</label>
          <Select value={viewDensity} onValueChange={(value) => setViewDensity(value as ViewDensity)}>
            <SelectTrigger id="view-density" className="w-[140px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">1 Week</SelectItem>
              <SelectItem value="2weeks">2 Weeks</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="2months">2 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ScheduleGrid 
          days={getVisibleDays()} 
          tracks={tracks} 
          sessions={sessions}
          viewDensity={viewDensity}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
