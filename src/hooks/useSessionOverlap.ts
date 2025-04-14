
import { useCallback } from 'react';
import { Session } from '@/types/schedule';

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export const useSessionOverlap = (sessions: Session[]) => {
  // Convert session time format to 24-hour format for comparison
  const parseTimeToMinutes = useCallback((timeString: string): number => {
    // Handle formats like "9am", "3:45pm", etc.
    const isPM = timeString.toLowerCase().includes('pm') && !timeString.toLowerCase().startsWith('12');
    let hours, minutes;
    
    if (timeString.includes(':')) {
      [hours, minutes] = timeString
        .toLowerCase()
        .replace('am', '')
        .replace('pm', '')
        .split(':')
        .map(part => parseInt(part));
    } else {
      hours = parseInt(timeString.toLowerCase().replace('am', '').replace('pm', ''));
      minutes = 0;
    }
    
    // Convert to 24-hour format
    if (isPM) {
      hours += 12;
    }
    
    return hours * 60 + minutes;
  }, []);
  
  // Parse a time range like "9am-12pm" to start and end minutes
  const parseTimeRange = useCallback((timeRange: string): TimeSlot => {
    const [start, end] = timeRange.split('-');
    return {
      startTime: start,
      endTime: end
    };
  }, []);
  
  // Get time slot from session time
  const getSessionTimeSlot = useCallback((session: Session): TimeSlot => {
    if (session.time === 'custom' && session.customStartTime && session.customEndTime) {
      return {
        startTime: session.customStartTime,
        endTime: session.customEndTime
      };
    } else if (session.time) {
      return parseTimeRange(session.time);
    }
    
    // Default fallback
    return {
      startTime: '9am',
      endTime: '12pm'
    };
  }, [parseTimeRange]);
  
  // Check if time slots overlap
  const doTimeSlotsOverlap = useCallback((slot1: TimeSlot, slot2: TimeSlot): boolean => {
    // For standard time slots like "9am-12pm"
    if (slot1.startTime.includes('am') || slot1.startTime.includes('pm')) {
      const slot1Start = parseTimeToMinutes(slot1.startTime);
      const slot1End = parseTimeToMinutes(slot1.endTime);
      const slot2Start = parseTimeToMinutes(slot2.startTime);
      const slot2End = parseTimeToMinutes(slot2.endTime);
      
      return (slot1Start < slot2End && slot1End > slot2Start);
    }
    
    // For custom time slots in 24h format like "09:00"
    const slot1Start = slot1.startTime;
    const slot1End = slot1.endTime;
    const slot2Start = slot2.startTime;
    const slot2End = slot2.endTime;
    
    return (slot1Start < slot2End && slot1End > slot2Start);
  }, [parseTimeToMinutes]);
  
  // Check if a session would overlap with existing sessions
  const checkSessionOverlap = useCallback((newSession: Session, sessionId?: string): boolean => {
    const newSessionTimeSlot = getSessionTimeSlot(newSession);
    
    return sessions.some(existingSession => 
      // Skip checking against itself for updates
      existingSession.id !== sessionId &&
      // Check if it's the same day
      existingSession.dayId === newSession.dayId &&
      // Check if it's the same instructor (only instructors can't be double-booked)
      existingSession.instructor === newSession.instructor &&
      // Check if the time slots overlap
      doTimeSlotsOverlap(
        getSessionTimeSlot(existingSession),
        newSessionTimeSlot
      )
    );
  }, [sessions, getSessionTimeSlot, doTimeSlotsOverlap]);
  
  return { checkSessionOverlap };
};
