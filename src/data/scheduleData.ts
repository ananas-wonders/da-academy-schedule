import { Day, Track, Session } from '@/components/ScheduleGrid';
import { addDays, format } from 'date-fns';

// Helper function to generate dates starting with the upcoming Saturday
const getNextSaturday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysUntilNextSaturday = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
  return addDays(today, daysUntilNextSaturday);
};

// Generate days with proper dates, starting from upcoming Saturday
const generateDaysWithDates = (numDays: number = 14): Day[] => {
  const startDate = getNextSaturday();
  const days: Day[] = [];
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = addDays(startDate, i);
    const dayName = format(currentDate, 'EEEE');
    const dateStr = format(currentDate, 'MMM d, yyyy');
    days.push({
      id: format(currentDate, 'yyyy-MM-dd'),
      name: dayName,
      date: dateStr,
      isFriday: dayName === 'Friday'
    });
  }
  
  return days;
};

// Generate 28 days (4 weeks) of data to support all view modes
export const allDays = generateDaysWithDates(28);

export const tracks: Track[] = [
  { id: 'track1', name: 'Track 1' },
  { id: 'track2', name: 'Track 2' },
  { id: 'track3', name: 'Track 3' },
  { id: 'track4', name: 'Track 4' },
];

export const sessions: Session[] = [
  // Monday
  {
    id: '1',
    dayId: 'mon',
    trackId: 'track1',
    title: 'Advanced Racing Techniques',
    instructor: 'John Smith',
    type: 'offline',
    count: 2,
    total: 5
  },
  {
    id: '2',
    dayId: 'mon',
    trackId: 'track2',
    title: 'Beginner Track Day',
    instructor: 'Jane Doe',
    type: 'offline',
    count: 1,
    total: 3
  },
  {
    id: '3',
    dayId: 'mon',
    trackId: 'track3',
    title: 'Virtual Racing Simulator',
    instructor: 'Mark Johnson',
    type: 'online',
    count: 3,
    total: 8
  },
  // Tuesday
  {
    id: '4',
    dayId: 'tue',
    trackId: 'track1',
    title: 'Defensive Driving',
    instructor: 'Sarah Williams',
    type: 'offline',
    count: 2,
    total: 4
  },
  {
    id: '5',
    dayId: 'tue',
    trackId: 'track1',
    title: 'Racing Theory',
    instructor: 'Michael Brown',
    type: 'online',
    count: 1,
    total: 6
  },
  {
    id: '6',
    dayId: 'tue',
    trackId: 'track2',
    title: 'Performance Analysis',
    instructor: 'Lisa Garcia',
    type: 'online',
    count: 4,
    total: 6
  },
  // Wednesday
  {
    id: '7',
    dayId: 'wed',
    trackId: 'track3',
    title: 'Wet Weather Driving',
    instructor: 'Robert Taylor',
    type: 'offline',
    count: 3,
    total: 7
  },
  {
    id: '8',
    dayId: 'wed',
    trackId: 'track4',
    title: 'Car Setup Basics',
    instructor: 'Amanda Wilson',
    type: 'offline',
    count: 2,
    total: 5
  },
  // Thursday
  {
    id: '9',
    dayId: 'thu',
    trackId: 'track2',
    title: 'Cornering Masterclass',
    instructor: 'David Martinez',
    type: 'offline',
    count: 5,
    total: 5
  },
  {
    id: '10',
    dayId: 'thu',
    trackId: 'track3',
    title: 'Virtual Pit Strategy',
    instructor: 'Emily Robinson',
    type: 'online',
    count: 2,
    total: 4
  },
  // Friday
  {
    id: '11',
    dayId: 'fri',
    trackId: 'track1',
    title: 'Race Day Preparation',
    instructor: 'Thomas Lee',
    type: 'offline',
    count: 4,
    total: 8
  },
  {
    id: '12',
    dayId: 'fri',
    trackId: 'track4',
    title: 'Advanced Telemetry',
    instructor: 'Kevin Clark',
    type: 'online',
    count: 3,
    total: 6
  },
  // Saturday - Multiple sessions in one cell
  {
    id: '13',
    dayId: 'sat',
    trackId: 'track2',
    title: 'Sprint Racing',
    instructor: 'Jennifer Adams',
    type: 'offline',
    count: 1,
    total: 4
  },
  {
    id: '14',
    dayId: 'sat',
    trackId: 'track2',
    title: 'Endurance Basics',
    instructor: 'Paul White',
    type: 'offline',
    count: 2,
    total: 5
  },
  {
    id: '15',
    dayId: 'sat',
    trackId: 'track2',
    title: 'Team Racing',
    instructor: 'Susan Brown',
    type: 'offline',
    count: 3,
    total: 6
  },
  {
    id: '16',
    dayId: 'sat',
    trackId: 'track2',
    title: 'Fuel Management',
    instructor: 'Brian Johnson',
    type: 'online',
    count: 1,
    total: 3
  },
  {
    id: '17',
    dayId: 'sat',
    trackId: 'track2',
    title: 'Race Rules & Etiquette',
    instructor: 'Michelle Lee',
    type: 'online',
    count: 2,
    total: 4
  },
  // Sunday
  {
    id: '18',
    dayId: 'sun',
    trackId: 'track1',
    title: 'Recovery Techniques',
    instructor: 'Matthew Davis',
    type: 'offline',
    count: 1,
    total: 2
  },
  {
    id: '19',
    dayId: 'sun',
    trackId: 'track3',
    title: 'Race Analysis',
    instructor: 'Jessica Wilson',
    type: 'online',
    count: 4,
    total: 7
  },
  {
    id: '20',
    dayId: 'sun',
    trackId: 'track4',
    title: 'Career Development',
    instructor: 'Andrew Scott',
    type: 'online',
    count: 2,
    total: 5
  },
];
