
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import SessionCard from '@/components/SessionCard';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  name: string;
}

interface Session {
  id: string;
  day_id: string;
  title: string;
  instructor: string;
  type: string;
  time: string;
  customStartTime?: string;
  customEndTime?: string;
  count?: number;
  total?: number;
}

interface Day {
  id: string;
  date: string;
  name: string;
  fullDate: Date;
}

const TrackView = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrackData = useCallback(async () => {
    if (!trackId) return;
    
    try {
      // Fetch track info
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .select('id, name')
        .eq('id', trackId)
        .single();

      if (trackError) throw trackError;
      setTrack(trackData);

      // Fetch sessions for this track with proper field mapping
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('track_id', trackId);

      if (sessionError) throw sessionError;
      
      const formattedSessions = sessionData.map(session => ({
        id: session.id,
        day_id: session.day_id,
        title: session.title,
        instructor: session.instructor,
        type: session.type,
        time: session.time,
        customStartTime: session.custom_start_time,
        customEndTime: session.custom_end_time,
        count: session.count || 0,
        total: session.total || 0
      }));
      
      setSessions(formattedSessions);

      // Get unique day IDs from sessions
      const uniqueDayIds = [...new Set(formattedSessions.map(session => session.day_id))];
      
      // Process days from day_ids (which should be in format 'YYYY-MM-DD')
      const processedDays = uniqueDayIds.map(dayId => {
        const date = new Date(dayId);
        return {
          id: dayId,
          date: format(date, 'MMM d, yyyy'),
          name: format(date, 'EEEE'),
          fullDate: date
        };
      }).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

      setDays(processedDays);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching track data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load track data.",
      });
      setLoading(false);
    }
  }, [trackId, toast]);

  useEffect(() => {
    fetchTrackData();
    
    // Set up real-time subscription with improved channel naming
    if (trackId) {
      const channel = supabase
        .channel(`track_${trackId}_sessions`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'sessions', 
            filter: `track_id=eq.${trackId}` 
          }, 
          (payload) => {
            console.log('Session change detected:', payload);
            fetchTrackData();
            toast({
              title: "Sessions Updated",
              description: "Session data has been updated",
            });
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for track_${trackId}_sessions:`, status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [trackId, fetchTrackData, toast]);

  // Memoize getSessionsForDay function to prevent unnecessary recalculations
  const getSessionsForDay = useCallback((dayId: string) => {
    return sessions.filter(session => session.day_id === dayId);
  }, [sessions]);

  // Add responsive skeletal loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading track data...</span>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center p-8 bg-gray-50 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Track not found</h1>
          <p className="text-gray-600">The track you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{track.name} Schedule</h1>
      
      {days.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg shadow">
          <p className="text-gray-500">No sessions scheduled for this track yet.</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {days.map(day => (
            <div key={day.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4">
              <div className="mb-3 sm:mb-4 border-b pb-2">
                <h2 className="text-lg sm:text-xl font-semibold">{day.name}</h2>
                <p className="text-gray-500 text-sm sm:text-base">{day.date}</p>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {getSessionsForDay(day.id).length > 0 ? (
                  getSessionsForDay(day.id).map(session => (
                    <div key={session.id} className="p-1 sm:p-2">
                      <SessionCard
                        title={session.title}
                        instructor={session.instructor}
                        type={session.type as any}
                        time={session.time as any}
                        customStartTime={session.customStartTime}
                        customEndTime={session.customEndTime}
                        count={session.count}
                        total={session.total}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No sessions scheduled for this day.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackView;
