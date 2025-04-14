
import React, { useState, useMemo } from 'react';
import ScheduleGrid from '@/components/ScheduleGrid';
import { ViewDensity } from '@/types/schedule';
import { Toaster } from "@/components/ui/toaster";
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import { useScheduleData } from '@/hooks/useScheduleData';
import { useScheduleDays } from '@/hooks/useScheduleDays';

const Index = () => {
  const [viewDensity, setViewDensity] = useState<ViewDensity>('week');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { tracks, setTracks, sessions, loading, trackVisibility, setTrackVisibility } = useScheduleData();
  const { days } = useScheduleDays(currentMonth, viewDensity);
  
  // Memoize visibleTracks calculation to prevent unnecessary recalculations on each render
  const visibleTracks = useMemo(() => 
    tracks.filter(track => trackVisibility[track.id] !== false),
  [tracks, trackVisibility]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading schedule data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 max-w-[1600px] mx-auto">
      <ScheduleHeader 
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        viewDensity={viewDensity}
        setViewDensity={setViewDensity}
        tracks={tracks}
        trackVisibility={trackVisibility}
        setTrackVisibility={setTrackVisibility}
        setTracks={setTracks}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
        <ScheduleGrid 
          days={days} 
          tracks={visibleTracks} 
          sessions={sessions}
          viewDensity={viewDensity}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
