
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

export type ViewDensity = '1week' | '2weeks' | 'month' | '2months' | 'week' | 'custom';
