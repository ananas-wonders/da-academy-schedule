
import { Day, Track, Session } from '@/components/ScheduleGrid';

export const days: Day[] = [
  { id: 'mon', name: 'Monday' },
  { id: 'tue', name: 'Tuesday' },
  { id: 'wed', name: 'Wednesday' },
  { id: 'thu', name: 'Thursday' },
  { id: 'fri', name: 'Friday' },
  { id: 'sat', name: 'Saturday' },
  { id: 'sun', name: 'Sunday' },
];

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
