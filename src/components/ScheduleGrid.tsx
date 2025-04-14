import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Day, Track, TrackGroup, Session, ViewDensity } from '@/types/schedule';
import EditSessionDialog from './schedule/EditSessionDialog';
import GroupSettings from './schedule/GroupSettings';
import ScheduleGridTable from './schedule/ScheduleGridTable';
import { SessionCardProps } from './SessionCard';

interface ScheduleGridProps {
  days: Day[];
  tracks: Track[];
  sessions: Session[];
  viewDensity: ViewDensity;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  days: initialDays, 
  tracks: initialTracks, 
  sessions: initialSessions,
  viewDensity
}) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [groups, setGroups] = useState<TrackGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [days, setDays] = useState<Day[]>(initialDays);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    // Set days from props
    setDays(initialDays);
    
    // Set tracks from props
    setTracks(initialTracks);
    
    // Set sessions from props
    setSessions(initialSessions);
    
    // Fetch track groups
    fetchTrackGroups();
  }, [initialDays, initialTracks, initialSessions]);

  const fetchTrackGroups = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('track_groups')
        .select('*');
        
      if (error) throw error;
      
      setGroups(data.map(group => ({
        id: group.id,
        name: group.name,
        color: group.color,
        visible: group.visible
      })));
    } catch (error) {
      console.error('Error fetching track groups:', error);
    }
  }, []);

  // Memoize visibleTracks calculation to prevent unnecessary recalculations
  const visibleTracks = useMemo(() => {
    return tracks.filter(track => {
      if (!track.groupId) return track.visible !== false;
      const group = groups.find(g => g.id === track.groupId);
      return group ? (group.visible !== false && track.visible !== false) : (track.visible !== false);
    });
  }, [tracks, groups]);

  const getSessionsForCell = useCallback((dayId: string, trackId: string) => {
    return sessions.filter(
      session => session.dayId === dayId && session.trackId === trackId
    ).slice(0, 5);
  }, [sessions]);

  // Memoize hasConflict function to prevent unnecessary calculations
  const hasConflict = useCallback((session: Session) => {
    return sessions.some(s => 
      s.id !== session.id && 
      s.dayId === session.dayId && 
      s.trackId !== session.trackId && 
      s.instructor === session.instructor &&
      s.time === session.time
    );
  }, [sessions]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTracks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });

      toast({
        title: "Track order updated",
        description: "The track order has been successfully updated",
      });
    }
  }, [toast]);

  const handleEditTrackName = useCallback(async (id: string, newName: string) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('tracks')
        .update({ name: newName })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTracks(tracks.map(track => 
        track.id === id ? { ...track, name: newName } : track
      ));

      toast({
        title: "Track renamed",
        description: `Track has been renamed to "${newName}"`,
      });
    } catch (error) {
      console.error('Error updating track name:', error);
      toast({
        variant: "destructive",
        title: "Error updating track",
        description: "Failed to update track name",
      });
    }
  }, [tracks, toast]);

  const handleAddTrack = useCallback(async () => {
    try {
      const newId = `track-${Date.now()}`;
      const newName = `New Track ${tracks.length + 1}`;
      
      // Add to database
      const { error } = await supabase
        .from('tracks')
        .insert([{ id: newId, name: newName, visible: true }]);
        
      if (error) throw error;
      
      // Update local state
      setTracks([...tracks, { id: newId, name: newName, visible: true }]);
      
      toast({
        title: "Track added",
        description: "A new track has been added to the schedule",
      });
    } catch (error) {
      console.error('Error adding track:', error);
      toast({
        variant: "destructive",
        title: "Error adding track",
        description: "Failed to add new track",
      });
    }
  }, [tracks, toast]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const newGroupId = `group-${Date.now()}`;
      const newGroup = { 
        id: newGroupId, 
        name: newGroupName,
        color: getRandomColor(),
        visible: true
      };
      
      // Add group to database
      const { error: groupError } = await supabase
        .from('track_groups')
        .insert([newGroup]);
        
      if (groupError) throw groupError;
      
      // Update tracks with group assignment
      for (const trackId of selectedTracks) {
        const { error: trackError } = await supabase
          .from('tracks')
          .update({ group_id: newGroupId })
          .eq('id', trackId);
          
        if (trackError) throw trackError;
      }
      
      // Update local state
      setGroups([...groups, newGroup]);
      
      setTracks(tracks.map(track => 
        selectedTracks.includes(track.id) ? { ...track, groupId: newGroupId } : track
      ));
      
      setNewGroupName('');
      setSelectedTracks([]);
      
      toast({
        title: "Track group created",
        description: `"${newGroupName}" group has been created with the selected tracks`,
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        variant: "destructive",
        title: "Error creating group",
        description: "Failed to create track group",
      });
    }
  };

  const handleUpdateGroups = async (updatedGroups: TrackGroup[]) => {
    try {
      // Update each group in the database
      for (const group of updatedGroups) {
        const { error } = await supabase
          .from('track_groups')
          .update({ 
            name: group.name,
            color: group.color,
            visible: group.visible
          })
          .eq('id', group.id);
          
        if (error) throw error;
      }
      
      // Update local state
      setGroups(updatedGroups);
      
      toast({
        title: "Groups updated",
        description: "Track groups have been successfully updated",
      });
    } catch (error) {
      console.error('Error updating groups:', error);
      toast({
        variant: "destructive",
        title: "Error updating groups",
        description: "Failed to update track groups",
      });
    }
  };

  const handleToggleGroupVisibility = useCallback(async (groupId: string, visible: boolean) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('track_groups')
        .update({ visible })
        .eq('id', groupId);
        
      if (error) throw error;
      
      // Update local state
      setGroups(groups.map(group => 
        group.id === groupId ? { ...group, visible } : group
      ));
      
      toast({
        title: visible ? "Group shown" : "Group hidden",
        description: `Group is now ${visible ? 'visible' : 'hidden'} in the schedule`,
      });
    } catch (error) {
      console.error('Error updating group visibility:', error);
      toast({
        variant: "destructive",
        title: "Error updating visibility",
        description: "Failed to update group visibility",
      });
    }
  }, [groups, toast]);

  const handleToggleTrackVisibility = useCallback(async (trackId: string, visible: boolean) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('tracks')
        .update({ visible })
        .eq('id', trackId);
        
      if (error) throw error;
      
      // Update local state
      setTracks(tracks.map(track => 
        track.id === trackId ? { ...track, visible } : track
      ));
      
      toast({
        title: visible ? "Track shown" : "Track hidden",
        description: `Track is now ${visible ? 'visible' : 'hidden'} in the schedule`,
      });
    } catch (error) {
      console.error('Error updating track visibility:', error);
      toast({
        variant: "destructive",
        title: "Error updating visibility",
        description: "Failed to update track visibility",
      });
    }
  }, [tracks, toast]);
  
  const handleCopyTrackLink = useCallback((trackId: string, trackName: string) => {
    const url = `${window.location.origin}/track/${trackId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: `Link to ${trackName} schedule has been copied to clipboard`,
      });
    }).catch(err => {
      console.error('Error copying text: ', err);
      toast({
        variant: "destructive",
        title: "Error copying link",
        description: "Failed to copy track link to clipboard",
      });
    });
  }, [toast]);

  const handleAddSession = useCallback(async (dayId: string, trackId: string, newSession: Omit<SessionCardProps, 'id'>) => {
    try {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const session: Session = {
        id: sessionId,
        dayId,
        trackId,
        ...newSession
      };
      
      // Add to database
      const { error } = await supabase
        .from('sessions')
        .insert([{
          id: sessionId,
          day_id: dayId,
          track_id: trackId,
          title: newSession.title,
          instructor: newSession.instructor,
          type: newSession.type,
          time: newSession.time,
          custom_start_time: newSession.customStartTime,
          custom_end_time: newSession.customEndTime,
          count: newSession.count,
          total: newSession.total
        }]);
        
      if (error) throw error;
      
      // Update local state
      setSessions([...sessions, session]);
      
      toast({
        title: "Session added",
        description: `A new session "${newSession.title}" has been added to the schedule`,
      });
    } catch (error) {
      console.error('Error adding session:', error);
      toast({
        variant: "destructive",
        title: "Error adding session",
        description: "Failed to add new session",
      });
    }
  }, [sessions, toast]);

  const handleEditSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setEditingSession(session);
      setSessionDialogOpen(true);
    }
  }, [sessions, setEditingSession, setSessionDialogOpen]);

  const handleSaveEditedSession = useCallback(async (updatedSession: Session) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('sessions')
        .update({
          title: updatedSession.title,
          instructor: updatedSession.instructor,
          type: updatedSession.type,
          time: updatedSession.time,
          custom_start_time: updatedSession.customStartTime,
          custom_end_time: updatedSession.customEndTime,
          count: updatedSession.count,
          total: updatedSession.total
        })
        .eq('id', updatedSession.id);
        
      if (error) throw error;
      
      // Update local state
      setSessions(sessions.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      ));
      
      toast({
        title: "Session updated",
        description: `The session "${updatedSession.title}" has been updated`,
      });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        variant: "destructive",
        title: "Error updating session",
        description: "Failed to update session",
      });
    }
  }, [sessions, toast]);

  const getRandomColor = useCallback(() => {
    const colors = [
      '#f87171', '#fb923c', '#fbbf24', '#a3e635', 
      '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', 
      '#c084fc', '#e879f9', '#fb7185'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const getTrackGroup = useCallback((track: Track) => {
    if (!track.groupId) return null;
    return groups.find(g => g.id === track.groupId) || null;
  }, [groups]);

  const today = useMemo(() => new Date(), []);

  return (
    <div className="overflow-x-auto">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-between mb-3 items-center">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" /> Group Settings
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Track Group Settings</SheetTitle>
                  <SheetDescription>
                    Manage your track groups, colors, and visibility
                  </SheetDescription>
                </SheetHeader>
                <GroupSettings 
                  groups={groups} 
                  onUpdateGroups={handleUpdateGroups}
                  onToggleGroupVisibility={handleToggleGroupVisibility}
                />
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddTrack}
            >
              Add Track
            </Button>
          </div>
        </div>

        <ScheduleGridTable
          days={days}
          visibleTracks={visibleTracks}
          sessions={sessions}
          today={today}
          onEditSession={handleEditSession}
          onAddSession={handleAddSession}
          onEditTrackName={handleEditTrackName}
          onToggleTrackVisibility={handleToggleTrackVisibility}
          onCopyTrackLink={handleCopyTrackLink}
          onAddTrack={handleAddTrack}
          hasConflict={hasConflict}
          getSessionsForCell={getSessionsForCell}
          getTrackGroup={getTrackGroup}
        />
      </DndContext>
      
      <EditSessionDialog 
        session={editingSession}
        onSave={handleSaveEditedSession}
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
      />
    </div>
  );
};

export default ScheduleGrid;
