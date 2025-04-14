
import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewDensity } from '@/types/schedule';

interface ViewSelectorProps {
  viewDensity: ViewDensity;
  setViewDensity: React.Dispatch<React.SetStateAction<ViewDensity>>;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ viewDensity, setViewDensity }) => {
  // Memoize options to prevent unnecessary recalculations
  const timeRangeOptions = useMemo(() => [
    { value: 'week', label: 'Week' },
    { value: '2weeks', label: '2 Weeks' },
    { value: 'month', label: 'Month' },
    { value: '2months', label: '2 Months' }
  ], []);

  const handleValueChange = (value: string) => {
    setViewDensity(value as ViewDensity);
  };

  return (
    <Select value={viewDensity} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[140px] sm:w-[160px] h-9">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {timeRangeOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ViewSelector;
