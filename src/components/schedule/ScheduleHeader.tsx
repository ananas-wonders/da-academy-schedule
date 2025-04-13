
import React from 'react';
import { Track, ViewDensity } from '@/types/schedule';
import { Card, CardContent } from "@/components/ui/card";
import DateNavigation from './DateNavigation';
import ViewSelector from './ViewSelector';
import FilterMenu from './FilterMenu';

interface ScheduleHeaderProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  viewDensity: ViewDensity;
  setViewDensity: React.Dispatch<React.SetStateAction<ViewDensity>>;
  tracks: Track[];
  trackVisibility: Record<string, boolean>;
  setTrackVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ 
  currentMonth,
  setCurrentMonth,
  viewDensity,
  setViewDensity,
  tracks,
  trackVisibility,
  setTrackVisibility,
  setTracks,
  isDatePickerOpen,
  setIsDatePickerOpen,
  isFilterOpen,
  setIsFilterOpen
}) => {
  return (
    <header className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Digital Arts and Design Academy Schedule</h1>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <DateNavigation
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  viewDensity={viewDensity}
                  isDatePickerOpen={isDatePickerOpen}
                  setIsDatePickerOpen={setIsDatePickerOpen}
                />
                
                <ViewSelector
                  viewDensity={viewDensity}
                  setViewDensity={setViewDensity}
                />
                
                <FilterMenu
                  tracks={tracks}
                  trackVisibility={trackVisibility}
                  setTrackVisibility={setTrackVisibility}
                  setTracks={setTracks}
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </header>
  );
};

export default ScheduleHeader;
