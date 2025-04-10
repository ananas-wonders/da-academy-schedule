
import React, { useState } from 'react';
import ScheduleGrid, { ViewDensity, Track, Session } from '@/components/ScheduleGrid';
import { allDays, sessions } from '@/data/scheduleData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { SessionType } from '@/components/SessionCard';

const Index = () => {
  const [viewDensity, setViewDensity] = useState<ViewDensity>('2weeks');
  const [tracks, setTracks] = useState<Track[]>([
    { id: 'track-1', name: 'Beginner Course' },
    { id: 'track-2', name: 'Intermediate' },
    { id: 'track-3', name: 'Advanced Course' },
    { id: 'track-4', name: 'Expert Racing' }
  ]);
  
  // Filter days based on selected view density
  const getVisibleDays = () => {
    switch (viewDensity) {
      case '1week':
        return allDays.slice(0, 7);
      case '2weeks':
        return allDays.slice(0, 14);
      case 'month':
        return allDays.slice(0, 21); // ~3 weeks (approximate month view)
      case '2months':
        return allDays.slice(0, 28); // 4 weeks (approximate 2 month view)
      default:
        return allDays.slice(0, 14); // Default to 2 weeks
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Track Day Schedule</h1>
        <p className="text-gray-600 text-center">View and manage all scheduled sessions across different tracks</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div className="legend flex gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--online))] mr-2"></div>
            <span className="text-sm">Online Session</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--offline))] mr-2"></div>
            <span className="text-sm">Offline Session</span>
          </div>
        </div>
        
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
      </div>

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
