
import { SessionType } from '@/components/SessionCard';

export const allDays = [
  {
    id: "day-1",
    name: "Sunday",
    date: "2024-07-07",
  },
  {
    id: "day-2",
    name: "Monday",
    date: "2024-07-08",
  },
  {
    id: "day-3",
    name: "Tuesday",
    date: "2024-07-09",
  },
  {
    id: "day-4",
    name: "Wednesday",
    date: "2024-07-10",
  },
  {
    id: "day-5",
    name: "Thursday",
    date: "2024-07-11",
  },
  {
    id: "day-6",
    name: "Friday",
    date: "2024-07-12",
    isFriday: true
  },
  {
    id: "day-7",
    name: "Saturday",
    date: "2024-07-13",
  },
  {
    id: "day-8",
    name: "Sunday",
    date: "2024-07-14",
  },
  {
    id: "day-9",
    name: "Monday",
    date: "2024-07-15",
  },
  {
    id: "day-10",
    name: "Tuesday",
    date: "2024-07-16",
  },
  {
    id: "day-11",
    name: "Wednesday",
    date: "2024-07-17",
  },
  {
    id: "day-12",
    name: "Thursday",
    date: "2024-07-18",
  },
  {
    id: "day-13",
    name: "Friday",
    date: "2024-07-19",
    isFriday: true
  },
  {
    id: "day-14",
    name: "Saturday",
    date: "2024-07-20",
  },
  {
    id: "day-15",
    name: "Sunday",
    date: "2024-07-21",
  },
  {
    id: "day-16",
    name: "Monday",
    date: "2024-07-22",
  },
  {
    id: "day-17",
    name: "Tuesday",
    date: "2024-07-23",
  },
    {
    id: "day-18",
    name: "Wednesday",
    date: "2024-07-24",
  },
  {
    id: "day-19",
    name: "Thursday",
    date: "2024-07-25",
  },
  {
    id: "day-20",
    name: "Friday",
    date: "2024-07-26",
    isFriday: true
  },
  {
    id: "day-21",
    name: "Saturday",
    date: "2024-07-27",
  },
  {
    id: "day-22",
    name: "Sunday",
    date: "2024-07-28",
  },
  {
    id: "day-23",
    name: "Monday",
    date: "2024-07-29",
  },
  {
    id: "day-24",
    name: "Tuesday",
    date: "2024-07-30",
  },
  {
    id: "day-25",
    name: "Wednesday",
    date: "2024-07-31",
  },
  {
    id: "day-26",
    name: "Thursday",
    date: "2024-08-01",
  },
  {
    id: "day-27",
    name: "Friday",
    date: "2024-08-02",
    isFriday: true
  },
  {
    id: "day-28",
    name: "Saturday",
    date: "2024-08-03",
  }
];

// Add more dummy sessions
export const sessions = [
  // Beginner Course sessions
  {
    id: "session-1",
    dayId: "day-1",
    trackId: "track-1",
    title: "Intro to Racing",
    instructor: "John Smith",
    type: "online" as SessionType,
    count: 12,
    total: 20
  },
  {
    id: "session-2",
    dayId: "day-2",
    trackId: "track-1",
    title: "Basic Techniques",
    instructor: "Maria Johnson",
    type: "offline" as SessionType,
    count: 8,
    total: 15
  },
  {
    id: "session-3",
    dayId: "day-3",
    trackId: "track-1",
    title: "Safety Rules",
    instructor: "Robert Chen",
    type: "online",
    count: 25,
    total: 30
  },
  
  // Intermediate sessions
  {
    id: "session-4",
    dayId: "day-1",
    trackId: "track-2",
    title: "Cornering Mastery",
    instructor: "Lisa Williams",
    type: "offline",
    count: 10,
    total: 12
  },
  {
    id: "session-5",
    dayId: "day-3",
    trackId: "track-2",
    title: "Braking Techniques",
    instructor: "Michael Brown",
    type: "offline",
    count: 7,
    total: 10
  },
  {
    id: "session-6",
    dayId: "day-4",
    trackId: "track-2",
    title: "Racing Lines",
    instructor: "Sarah Davis",
    type: "online",
    count: 15,
    total: 20
  },
  
  // Advanced Course sessions
  {
    id: "session-7",
    dayId: "day-2",
    trackId: "track-3",
    title: "Advanced Tactics",
    instructor: "James Wilson",
    type: "offline",
    count: 8,
    total: 8
  },
  {
    id: "session-8",
    dayId: "day-5",
    trackId: "track-3",
    title: "Race Simulation",
    instructor: "Emily Taylor",
    type: "online",
    count: 12,
    total: 15
  },
  
  // Expert Racing sessions
  {
    id: "session-9",
    dayId: "day-1",
    trackId: "track-4",
    title: "Pro Racing Workshop",
    instructor: "Daniel Martinez",
    type: "offline",
    count: 6,
    total: 6
  },
  {
    id: "session-10",
    dayId: "day-3",
    trackId: "track-4",
    title: "Championship Prep",
    instructor: "Olivia Anderson",
    type: "offline",
    count: 4,
    total: 5
  },
  {
    id: "session-11",
    dayId: "day-6",
    trackId: "track-4",
    title: "Advanced Analytics",
    instructor: "Noah Thompson",
    type: "online",
    count: 8,
    total: 10
  },
  
  // Additional sessions
  {
    id: "session-12",
    dayId: "day-7",
    trackId: "track-1",
    title: "Weekend Basics",
    instructor: "Sophia Lee",
    type: "offline",
    count: 18,
    total: 20
  },
  {
    id: "session-13",
    dayId: "day-7",
    trackId: "track-3",
    title: "Weekend Advanced",
    instructor: "William Garcia",
    type: "online",
    count: 9,
    total: 15
  },
  {
    id: "session-14",
    dayId: "day-10",
    trackId: "track-2",
    title: "Intermediate Challenge",
    instructor: "Ava Nelson",
    type: "offline",
    count: 10,
    total: 12
  },
  {
    id: "session-15",
    dayId: "day-12",
    trackId: "track-4",
    title: "Expert Speed Session",
    instructor: "Ethan Wright",
    type: "offline",
    count: 5,
    total: 6
  }
];
