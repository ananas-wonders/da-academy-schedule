
import { SessionType, SessionTime, type SessionCardProps } from '@/components/SessionCard';

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

export const sessions = [
  {
    id: "session-1",
    dayId: "day-1",
    trackId: "track-1",
    title: "Intro to Racing",
    instructor: "John Smith",
    type: "online" as SessionType,
    count: 12,
    total: 20,
    time: "9am-12pm" as SessionTime
  },
  {
    id: "session-2",
    dayId: "day-2",
    trackId: "track-1",
    title: "Basic Techniques",
    instructor: "Maria Johnson",
    type: "offline" as SessionType,
    count: 8,
    total: 15,
    time: "1pm-3:45pm" as SessionTime
  },
  {
    id: "session-3",
    dayId: "day-3",
    trackId: "track-1",
    title: "Safety Rules",
    instructor: "Robert Chen",
    type: "online" as SessionType,
    count: 25,
    total: 30,
    time: "4pm-6:45pm" as SessionTime
  },
  
  {
    id: "session-4",
    dayId: "day-1",
    trackId: "track-2",
    title: "Cornering Mastery",
    instructor: "Lisa Williams",
    type: "offline" as SessionType,
    count: 10,
    total: 12,
    time: "9am-12pm" as SessionTime
  },
  {
    id: "session-5",
    dayId: "day-3",
    trackId: "track-2",
    title: "Braking Techniques",
    instructor: "Michael Brown",
    type: "offline" as SessionType,
    count: 7,
    total: 10,
    time: "1pm-3:45pm" as SessionTime
  },
  {
    id: "session-6",
    dayId: "day-4",
    trackId: "track-2",
    title: "Racing Lines",
    instructor: "Sarah Davis",
    type: "online" as SessionType,
    count: 15,
    total: 20,
    time: "4pm-6:45pm" as SessionTime
  },
  
  {
    id: "session-7",
    dayId: "day-2",
    trackId: "track-3",
    title: "Advanced Tactics",
    instructor: "James Wilson",
    type: "offline" as SessionType,
    count: 8,
    total: 8,
    time: "9am-12pm" as SessionTime
  },
  {
    id: "session-8",
    dayId: "day-5",
    trackId: "track-3",
    title: "Race Simulation",
    instructor: "Emily Taylor",
    type: "online" as SessionType,
    count: 12,
    total: 15,
    time: "1pm-3:45pm" as SessionTime
  },
  
  {
    id: "session-9",
    dayId: "day-1",
    trackId: "track-4",
    title: "Pro Racing Workshop",
    instructor: "Daniel Martinez",
    type: "offline" as SessionType,
    count: 6,
    total: 6,
    time: "4pm-6:45pm" as SessionTime
  },
  {
    id: "session-10",
    dayId: "day-3",
    trackId: "track-4",
    title: "Championship Prep",
    instructor: "Olivia Anderson",
    type: "offline" as SessionType,
    count: 4,
    total: 5,
    time: "9am-12pm" as SessionTime
  },
  {
    id: "session-11",
    dayId: "day-6",
    trackId: "track-4",
    title: "Advanced Analytics",
    instructor: "Noah Thompson",
    type: "online" as SessionType,
    count: 8,
    total: 10,
    time: "1pm-3:45pm" as SessionTime
  },
  
  {
    id: "session-12",
    dayId: "day-7",
    trackId: "track-1",
    title: "Weekend Basics",
    instructor: "Sophia Lee",
    type: "offline" as SessionType,
    count: 18,
    total: 20,
    time: "4pm-6:45pm" as SessionTime
  },
  {
    id: "session-13",
    dayId: "day-7",
    trackId: "track-3",
    title: "Weekend Advanced",
    instructor: "William Garcia",
    type: "online" as SessionType,
    count: 9,
    total: 15,
    time: "9am-12pm" as SessionTime
  },
  {
    id: "session-14",
    dayId: "day-10",
    trackId: "track-2",
    title: "Intermediate Challenge",
    instructor: "Ava Nelson",
    type: "offline" as SessionType,
    count: 10,
    total: 12,
    time: "1pm-3:45pm" as SessionTime
  },
  {
    id: "session-15",
    dayId: "day-12",
    trackId: "track-4",
    title: "Expert Speed Session",
    instructor: "Ethan Wright",
    type: "offline" as SessionType,
    count: 5,
    total: 6,
    time: "4pm-6:45pm" as SessionTime
  }
];

export interface Session {
  id: string;
  dayId: string;
  trackId: string;
  title: string;
  instructor: string;
  type: SessionType;
  count: number;
  total: number;
  time?: SessionTime;
  customStartTime?: string;
  customEndTime?: string;
  highlighted?: boolean;
}

// Helper function to check for instructor conflicts (same instructor, same day, same time in different tracks)
export const checkInstructorConflicts = (sessions: Session[]): Session[] => {
  const sessionsByDay = {};
  
  // Group sessions by day and time
  sessions.forEach(session => {
    const key = `${session.dayId}-${session.time}`;
    if (!sessionsByDay[key]) {
      sessionsByDay[key] = [];
    }
    sessionsByDay[key].push(session);
  });
  
  // Check for conflicts and mark sessions
  const conflictedSessions = new Set<string>();
  
  Object.values(sessionsByDay).forEach((daySessions: Session[]) => {
    // Check if any instructor appears more than once in this day+time group
    const instructorCounts = {};
    daySessions.forEach(session => {
      if (!instructorCounts[session.instructor]) {
        instructorCounts[session.instructor] = [];
      }
      instructorCounts[session.instructor].push(session.id);
    });
    
    // If instructor has more than one session at this time, mark all as conflicts
    Object.values(instructorCounts).forEach((sessionIds: string[]) => {
      if (sessionIds.length > 1) {
        sessionIds.forEach(id => conflictedSessions.add(id));
      }
    });
  });
  
  // Mark conflicted sessions
  return sessions.map(session => ({
    ...session,
    highlighted: conflictedSessions.has(session.id)
  }));
};
