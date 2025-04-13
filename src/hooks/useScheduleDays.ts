
import { useState, useEffect } from 'react';
import { ViewDensity } from '@/components/ScheduleGrid';
import { 
  format, 
  addMonths, 
  addWeeks, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth,
  startOfWeek, 
  endOfWeek,
  isFriday,
  getWeek
} from 'date-fns';

export const useScheduleDays = (currentMonth: Date, viewDensity: ViewDensity) => {
  const [days, setDays] = useState<any[]>([]);

  useEffect(() => {
    generateDays(currentMonth, viewDensity);
  }, [currentMonth, viewDensity]);

  const generateDays = (baseDate: Date, density: ViewDensity) => {
    let start, end;
    
    switch (density) {
      case 'week':
        // Adjust to start from Saturday (6 = Saturday in JS date) instead of Monday
        start = startOfWeek(baseDate, { weekStartsOn: 6 });
        end = endOfWeek(baseDate, { weekStartsOn: 6 });
        break;
      case '2weeks':
        start = startOfWeek(baseDate, { weekStartsOn: 6 });
        end = endOfWeek(addWeeks(baseDate, 1), { weekStartsOn: 6 });
        break;
      case 'month':
        start = startOfMonth(baseDate);
        end = endOfMonth(baseDate);
        break;
      case '2months':
        start = startOfMonth(baseDate);
        end = endOfMonth(addMonths(baseDate, 1));
        break;
      default:
        start = startOfWeek(baseDate, { weekStartsOn: 6 });
        end = endOfWeek(baseDate, { weekStartsOn: 6 });
    }
    
    const daysArray = eachDayOfInterval({ start, end });
    
    const formattedDays = daysArray.map(day => {
      // Get week number for Saturday
      const weekNum = day.getDay() === 6 ? getWeek(day) : undefined;
      
      return {
        id: format(day, 'yyyy-MM-dd'),
        name: format(day, 'EEEE'),
        date: format(day, 'MMM d, yyyy'),
        fullDate: day,
        isFriday: isFriday(day),
        weekNumber: weekNum
      };
    });
    
    setDays(formattedDays);
  };

  return { days };
};
