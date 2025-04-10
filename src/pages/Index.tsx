
import React from 'react';
import ScheduleGrid from '@/components/ScheduleGrid';
import { days, tracks, sessions } from '@/data/scheduleData';

const Index = () => {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Track Day Schedule</h1>
        <p className="text-gray-600 text-center">View all scheduled sessions across different tracks</p>
      </header>

      <div className="legend flex gap-4 justify-center mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--online))] mr-2"></div>
          <span className="text-sm">Online Session</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--offline))] mr-2"></div>
          <span className="text-sm">Offline Session</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ScheduleGrid 
          days={days} 
          tracks={tracks} 
          sessions={sessions} 
        />
      </div>
    </div>
  );
};

export default Index;
