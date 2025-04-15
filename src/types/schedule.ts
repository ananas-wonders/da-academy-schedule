
import { SessionCardProps, SessionType, SessionTime } from '@/components/SessionCard';

export interface Track {
  id: string;
  name: string;
  groupId?: string;
  visible?: boolean;
}

export interface TrackGroup {
  id: string;
  name: string;
  color?: string;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Day {
  id: string;
  name: string;
  date: string;
  fullDate: Date;
  isFriday?: boolean;
  weekNumber?: number;
}

export interface Session extends SessionCardProps {
  id: string;
  dayId: string;
  trackId: string;
}

export interface Course {
  id: string;
  courseCode: string;
  term: string;
  title: string;
  lectureHours: number;
  labHours: number;
  selfStudyHours: number;
  totalHours: number;
  numberOfSessions: number;
  scheduledSessions: number;
  status: 'scheduled' | 'partially-scheduled' | 'not-scheduled';
  category: string;
  notes: string;
  trackId: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  duration?: number;
}

export type ViewDensity = '1week' | '2weeks' | 'month' | '2months' | 'week' | 'custom';
