
import { useCallback } from 'react';
import { Session } from '@/types/schedule';
import { useSessionOverlap, TimeSlot } from '@/hooks/useSessionOverlap';

export const useAvailableTimeSlots = (allSessions: Session[]) => {
  const { checkSessionOverlap, doTimeSlotsOverlap, getSessionTimeSlot } = useSessionOverlap(allSessions);
  
  const isTimeSlotAvailable = useCallback((dayId: string, trackId: string, timeSlot: string): boolean => {
    const sessionsForDay = allSessions.filter(s => s.dayId === dayId && s.trackId === trackId);
    
    if (sessionsForDay.length === 0) return true;
    
    const newSessionTimeSlot = {
      startTime: timeSlot.split('-')[0],
      endTime: timeSlot.split('-')[1]
    };
    
    return !sessionsForDay.some(existingSession => {
      const existingTimeSlot = getSessionTimeSlot(existingSession);
      return doTimeSlotsOverlap(existingTimeSlot, newSessionTimeSlot);
    });
  }, [allSessions, doTimeSlotsOverlap, getSessionTimeSlot]);
  
  const getOccupiedTimeSlots = useCallback((dayId: string, trackId: string): TimeSlot[] => {
    return allSessions
      .filter(s => s.dayId === dayId && s.trackId === trackId)
      .map(session => getSessionTimeSlot(session));
  }, [allSessions, getSessionTimeSlot]);
  
  return {
    isTimeSlotAvailable,
    getOccupiedTimeSlots,
    checkSessionOverlap
  };
};
