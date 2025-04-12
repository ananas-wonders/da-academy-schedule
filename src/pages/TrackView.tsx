
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
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

  useEffect(() => {
    if (trackId) {
      fetchTrackData();
    }
  }, [trackId]);

  const fetchTrackData = async () => {
    try {
      // Fetch track info - simplified the query to avoid relationship errors
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .select('id, name')
        .eq('id', trackId)
        .single();

      if (trackError) throw trackError;
      setTrack(trackData);

      // Fetch sessions for this track
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('track_id', trackId);

      if (sessionError) throw sessionError;
      setSessions(sessionData);

      // Get unique day IDs from sessions
      const uniqueDayIds = [...new Set(sessionData.map(session => session.day_id))];
      
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
  };

  // Get sessions for a specific day
  const getSessionsForDay = (dayId: string) => {
    return sessions.filter(session => session.day_id === dayId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading track data...</span>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Track not found</h1>
          <p>The track you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{track.name} Schedule</h1>
      
      {days.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No sessions scheduled for this track yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {days.map(day => (
            <div key={day.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4 border-b pb-2">
                <h2 className="text-xl font-semibold">{day.name}</h2>
                <p className="text-gray-500">{day.date}</p>
              </div>
              
              <div className="space-y-3">
                {getSessionsForDay(day.id).length > 0 ? (
                  getSessionsForDay(day.id).map(session => (
                    <div key={session.id} className="p-2">
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
