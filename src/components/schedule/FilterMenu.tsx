
import React from 'react';
import { Track } from '@/components/ScheduleGrid';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import TrackFilter from './TrackFilter';

interface FilterMenuProps {
  tracks: Track[];
  trackVisibility: Record<string, boolean>;
  setTrackVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ 
  tracks, 
  trackVisibility, 
  setTrackVisibility,
  setTracks,
  isFilterOpen, 
  setIsFilterOpen 
}) => {
  return (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters & Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Track Visibility</h4>
            <TrackFilter 
              tracks={tracks} 
              trackVisibility={trackVisibility} 
              setTrackVisibility={setTrackVisibility}
              setTracks={setTracks}
            />
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Group Settings</h4>
            <Button variant="outline" size="sm" className="w-full">
              Manage Track Groups
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterMenu;
