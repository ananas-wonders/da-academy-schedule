
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, LayoutGrid, LayoutList } from 'lucide-react';
import { Track } from '@/types/track';
import TrackCard from '@/components/track/TrackCard';
import TrackTable from '@/components/track/TrackTable';
import TrackFormDialog from '@/components/track/TrackFormDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Tracks: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [editTrack, setEditTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch tracks from Supabase
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tracks')
          .select('*');
        
        if (error) throw error;
        
        // Convert data to our Track interface format
        const formattedTracks: Track[] = data.map((track: any) => ({
          id: track.id,
          programName: track.name || '',
          code: track.code || '',
          supervisor: track.supervisor || '',
          deputySupervisor: track.deputy_supervisor || '',
          studentsCount: track.students_count || 0,
          studentCoordinator: track.student_coordinator || '',
          teamsLink: track.teams_link || '',
          assignmentFolder: track.assignment_folder || '',
          gradeSheet: track.grade_sheet || '',
          attendanceForm: track.attendance_form || '',
          telegramGeneralGroup: track.telegram_general_group || '',
          telegramCourseGroup: track.telegram_course_group || '',
          createdAt: track.created_at,
          updatedAt: track.updated_at
        }));
        
        setTracks(formattedTracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tracks data."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTracks();
  }, [toast]);

  // Memoize filtered tracks for performance
  const filteredTracks = useMemo(() => tracks.filter(track => 
    track.programName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    track.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.supervisor.toLowerCase().includes(searchQuery.toLowerCase())
  ), [tracks, searchQuery]);

  const handleAddTrack = useCallback(async (newTrack: Partial<Track>) => {
    try {
      const trackWithId = {
        ...newTrack,
        id: `track-${Date.now()}`
      } as Track;
      
      // Convert to snake_case for database
      const dbTrack = {
        id: trackWithId.id,
        name: trackWithId.programName,
        code: trackWithId.code,
        supervisor: trackWithId.supervisor,
        deputy_supervisor: trackWithId.deputySupervisor,
        students_count: trackWithId.studentsCount,
        student_coordinator: trackWithId.studentCoordinator,
        teams_link: trackWithId.teamsLink,
        assignment_folder: trackWithId.assignmentFolder,
        grade_sheet: trackWithId.gradeSheet,
        attendance_form: trackWithId.attendanceForm,
        telegram_general_group: trackWithId.telegramGeneralGroup,
        telegram_course_group: trackWithId.telegramCourseGroup
      };
      
      const { error } = await supabase
        .from('tracks')
        .insert([dbTrack]);
      
      if (error) throw error;
      
      // Add timestamps
      trackWithId.createdAt = new Date().toISOString();
      trackWithId.updatedAt = new Date().toISOString();
      
      setTracks(prev => [...prev, trackWithId]);
      
      toast({
        title: "Track Added",
        description: `${newTrack.programName} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding track:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add track."
      });
    }
  }, [toast]);

  const handleEditTrack = useCallback(async (updatedTrack: Partial<Track>) => {
    if (!editTrack) return;
    
    try {
      // Convert to snake_case for database
      const dbTrack = {
        name: updatedTrack.programName,
        code: updatedTrack.code,
        supervisor: updatedTrack.supervisor,
        deputy_supervisor: updatedTrack.deputySupervisor,
        students_count: updatedTrack.studentsCount,
        student_coordinator: updatedTrack.studentCoordinator,
        teams_link: updatedTrack.teamsLink,
        assignment_folder: updatedTrack.assignmentFolder,
        grade_sheet: updatedTrack.gradeSheet,
        attendance_form: updatedTrack.attendanceForm,
        telegram_general_group: updatedTrack.telegramGeneralGroup,
        telegram_course_group: updatedTrack.telegramCourseGroup,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('tracks')
        .update(dbTrack)
        .eq('id', editTrack.id);
      
      if (error) throw error;
      
      setTracks(prev => prev.map(track => 
        track.id === editTrack.id 
          ? { ...track, ...updatedTrack, updatedAt: new Date().toISOString() } 
          : track
      ));
      
      toast({
        title: "Track Updated",
        description: `${updatedTrack.programName} has been updated successfully.`,
      });
      
      setEditTrack(null);
    } catch (error) {
      console.error('Error updating track:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update track."
      });
    }
  }, [editTrack, toast]);

  const handleDeleteTrack = useCallback(async (id: string) => {
    try {
      const trackToDelete = tracks.find(t => t.id === id);
      
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTracks(prev => prev.filter(track => track.id !== id));
      
      toast({
        title: "Track Removed",
        description: `${trackToDelete?.programName} has been removed.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting track:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete track."
      });
    }
  }, [tracks, toast]);

  const startEdit = useCallback((track: Track) => {
    setEditTrack(track);
    setDialogOpen(true);
  }, []);

  const handleOpenDialog = useCallback(() => {
    setEditTrack(null);
    setDialogOpen(true);
  }, []);

  const handleSaveTrack = useCallback((track: Partial<Track>) => {
    if (editTrack) {
      handleEditTrack(track);
    } else {
      handleAddTrack(track);
    }
  }, [editTrack, handleAddTrack, handleEditTrack]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading tracks data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Tracks</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'cards' ? "default" : "outline"} 
              onClick={() => setViewMode('cards')}
              size="sm"
            >
              <LayoutGrid className="h-4 w-4 mr-2" /> Cards
            </Button>
            <Button 
              variant={viewMode === 'table' ? "default" : "outline"} 
              onClick={() => setViewMode('table')}
              size="sm"
            >
              <LayoutList className="h-4 w-4 mr-2" /> Table
            </Button>
          </div>
          <Button onClick={handleOpenDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add New Track
          </Button>
        </div>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search tracks by program name, code, or supervisor"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No tracks found matching your search criteria.
            </div>
          ) : (
            filteredTracks.map(track => (
              <TrackCard 
                key={track.id}
                track={track}
                onEdit={startEdit}
                onDelete={handleDeleteTrack}
              />
            ))
          )}
        </div>
      ) : (
        <TrackTable 
          tracks={filteredTracks} 
          onEdit={startEdit} 
          onDelete={handleDeleteTrack} 
        />
      )}

      <TrackFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        track={editTrack}
        onSave={handleSaveTrack}
      />
    </div>
  );
};

export default Tracks;
