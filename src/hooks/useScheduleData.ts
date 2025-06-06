
import { useState, useEffect, useCallback } from 'react';
import { Session } from '@/data/scheduleData';
import { Track, TrackGroup } from '@/types/schedule';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useScheduleData = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackGroups, setTrackGroups] = useState<TrackGroup[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackVisibility, setTrackVisibility] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Memoize fetchData function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // First fetch track groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('track_groups')
        .select('*');
      
      if (groupsError) throw groupsError;
      
      setTrackGroups(groupsData || []);
      
      // Then fetch tracks separately
      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*');
      
      if (tracksError) throw tracksError;
      
      // Map the tracks and associate with groups in memory
      const formattedTracks = tracksData.map((track: any) => {
        const trackGroup = groupsData.find((group: any) => group.id === track.group_id);
        
        return {
          id: track.id,
          name: track.name,
          groupId: track.group_id,
          visible: track.visible !== false // Default to true if not specified
        };
      });
      
      setTracks(formattedTracks);
      
      const visibilityState = tracksData.reduce((acc: Record<string, boolean>, track: any) => {
        acc[track.id] = track.visible !== false;
        return acc;
      }, {});
      setTrackVisibility(visibilityState);

      // Get sessions and properly map the fields
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*');
      
      if (sessionsError) throw sessionsError;
      
      const formattedSessions = sessionsData.map((session: any) => ({
        id: session.id,
        dayId: session.day_id,
        trackId: session.track_id,
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load schedule data.",
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions with optimized filter conditions
    const channel = supabase
      .channel('schedule_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tracks' }, 
        (payload) => {
          console.log('Track changes detected:', payload);
          fetchData();
          toast({
            title: "Tracks Updated",
            description: "Track data has been updated",
          });
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sessions' }, 
        (payload) => {
          console.log('Session changes detected:', payload);
          fetchData();
          toast({
            title: "Sessions Updated",
            description: "Session data has been updated",
          });
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'track_groups' }, 
        (payload) => {
          console.log('Group changes detected:', payload);
          fetchData();
          toast({
            title: "Track Groups Updated",
            description: "Track group data has been updated",
          });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { tracks, setTracks, sessions, loading, trackVisibility, setTrackVisibility, trackGroups };
};
