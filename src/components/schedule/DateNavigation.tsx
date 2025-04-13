import React from 'react';
import { format, addWeeks, addMonths, subMonths, getMonth, getYear, setMonth, setYear } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewDensity } from '@/types/schedule';

interface DateNavigationProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  viewDensity: ViewDensity;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  currentMonth,
  setCurrentMonth,
  viewDensity,
  isDatePickerOpen,
  setIsDatePickerOpen
}) => {
  const handlePreviousMonth = () => {
    if (viewDensity === 'week' || viewDensity === '2weeks') {
      setCurrentMonth(prev => addWeeks(prev, -1));
    } else {
      setCurrentMonth(prev => subMonths(prev, 1));
    }
  };

  const handleNextMonth = () => {
    if (viewDensity === 'week' || viewDensity === '2weeks') {
      setCurrentMonth(prev => addWeeks(prev, 1));
    } else {
      setCurrentMonth(prev => addMonths(prev, 1));
    }
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(prev => setMonth(prev, month));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(prev => setYear(prev, year));
  };

  const getTimeRangeDisplay = () => {
    switch (viewDensity) {
      case 'week':
        return `Week of ${format(new Date(currentMonth), 'MMM d, yyyy')}`;
      case '2weeks':
        return `2 Weeks from ${format(new Date(currentMonth), 'MMM d')} to ${format(addWeeks(new Date(currentMonth), 1), 'MMM d, yyyy')}`;
      case 'month':
        return format(currentMonth, 'MMMM yyyy');
      case '2months':
        return `${format(currentMonth, 'MMMM')} - ${format(addMonths(currentMonth, 1), 'MMMM yyyy')}`;
      default:
        return format(currentMonth, 'MMMM yyyy');
    }
  };

  const currentYear = getYear(new Date());
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[180px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getTimeRangeDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="flex justify-between mb-3">
              <Select 
                value={String(getMonth(currentMonth))} 
                onValueChange={(value) => handleMonthChange(Number(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {format(new Date(2000, i, 1), 'MMMM')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={String(getYear(currentMonth))} 
                onValueChange={(value) => handleYearChange(Number(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Calendar
              mode="single"
              selected={currentMonth}
              onSelect={(date) => {
                if (date) {
                  setCurrentMonth(date);
                  setIsDatePickerOpen(false);
                }
              }}
              className="rounded-md border"
            />
          </div>
        </PopoverContent>
      </Popover>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateNavigation;
