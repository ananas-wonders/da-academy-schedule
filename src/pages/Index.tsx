
import React, { useState } from 'react';
import ScheduleGrid, { ViewDensity } from '@/components/ScheduleGrid';
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
  
  const visibleTracks = tracks.filter(track => trackVisibility[track.id] !== false);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading schedule data...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1600px] mx-auto">
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
