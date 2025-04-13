
import React from 'react';
import { Track } from '@/types/schedule';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
          Filters
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterMenu;
