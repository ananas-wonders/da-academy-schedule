
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewDensity } from '@/components/ScheduleGrid';

interface ViewSelectorProps {
  viewDensity: ViewDensity;
  setViewDensity: React.Dispatch<React.SetStateAction<ViewDensity>>;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ viewDensity, setViewDensity }) => {
  const timeRangeOptions = [
    { value: 'week', label: 'Week' },
    { value: '2weeks', label: '2 Weeks' },
    { value: 'month', label: 'Month' },
    { value: '2months', label: '2 Months' }
  ];

  return (
    <Select value={viewDensity} onValueChange={(value) => setViewDensity(value as ViewDensity)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent>
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
