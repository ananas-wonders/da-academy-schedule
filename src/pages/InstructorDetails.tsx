
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Instructor } from '@/types/instructor';
import InstructorCard from '@/components/instructor/InstructorCard';
import InstructorTable from '@/components/instructor/InstructorTable';
import InstructorFormDialog from '@/components/instructor/InstructorFormDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch instructors from Supabase
const fetchInstructors = async (): Promise<Instructor[]> => {
  const { data, error } = await supabase
    .from('instructors')
    .select('*');
  
  if (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
  
  return data.map((instructor): Instructor => ({
    id: instructor.id,
    name: instructor.name,
    email: instructor.email || '',
    phone: instructor.phone || '',
    subject: instructor.subject || '',
    company: instructor.company || '',
    notes: instructor.notes || '',
    specialization: instructor.specialization || [],
    imageUrl: instructor.imageUrl || '',
  }));
};

const InstructorDetails: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query to fetch instructors
  const { data: instructors = [], isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: fetchInstructors,
  });

  // Mutations for adding, editing, and deleting instructors
  const addInstructorMutation = useMutation({
    mutationFn: async (newInstructor: Partial<Instructor>) => {
      const { data, error } = await supabase
        .from('instructors')
        .insert([{
          name: newInstructor.name,
          email: newInstructor.email,
          phone: newInstructor.phone,
          subject: newInstructor.subject,
          company: newInstructor.company,
          notes: newInstructor.notes,
          specialization: newInstructor.specialization,
          imageUrl: newInstructor.imageUrl,
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast({
        title: "Instructor Added",
        description: "The instructor has been added successfully.",
      });
    },
    onError: (error) => {
      console.error('Error adding instructor:', error);
      toast({
        title: "Error",
        description: "Failed to add instructor.",
        variant: "destructive",
      });
    },
  });

  const editInstructorMutation = useMutation({
    mutationFn: async (updatedInstructor: Partial<Instructor>) => {
      const { data, error } = await supabase
        .from('instructors')
        .update({
          name: updatedInstructor.name,
          email: updatedInstructor.email,
          phone: updatedInstructor.phone,
          subject: updatedInstructor.subject,
          company: updatedInstructor.company,
          notes: updatedInstructor.notes,
          specialization: updatedInstructor.specialization,
          imageUrl: updatedInstructor.imageUrl,
        })
        .eq('id', updatedInstructor.id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast({
        title: "Instructor Updated",
        description: "The instructor has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating instructor:', error);
      toast({
        title: "Error",
        description: "Failed to update instructor.",
        variant: "destructive",
      });
    },
  });

  const deleteInstructorMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('instructors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast({
        title: "Instructor Removed",
        description: "The instructor has been removed.",
      });
    },
    onError: (error) => {
      console.error('Error deleting instructor:', error);
      toast({
        title: "Error",
        description: "Failed to delete instructor.",
        variant: "destructive",
      });
    },
  });

  // Memoize filtered instructors for performance
  const filteredInstructors = useMemo(() => instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    instructor.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (instructor.subject && instructor.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (instructor.company && instructor.company.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [instructors, searchQuery]);

  const handleAddInstructor = useCallback((newInstructor: Partial<Instructor>) => {
    addInstructorMutation.mutate(newInstructor);
  }, [addInstructorMutation]);

  const handleEditInstructor = useCallback((updatedInstructor: Partial<Instructor>) => {
    if (!editInstructor) return;
    editInstructorMutation.mutate({ ...updatedInstructor, id: editInstructor.id });
    setEditInstructor(null);
  }, [editInstructor, editInstructorMutation]);

  const handleDeleteInstructor = useCallback((id: string) => {
    deleteInstructorMutation.mutate(id);
  }, [deleteInstructorMutation]);

  const startEdit = useCallback((instructor: Instructor) => {
    setEditInstructor(instructor);
    setDialogOpen(true);
  }, []);

  const handleOpenDialog = useCallback(() => {
    setEditInstructor(null);
    setDialogOpen(true);
  }, []);

  const handleSaveInstructor = useCallback((instructor: Partial<Instructor>) => {
    if (editInstructor) {
      handleEditInstructor(instructor);
    } else {
      handleAddInstructor(instructor);
    }
  }, [editInstructor, handleAddInstructor, handleEditInstructor]);

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4">Loading instructors...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-red-500">Error loading instructors: {(error as Error).message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['instructors'] })}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Instructor Details</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'cards' ? "default" : "outline"} 
              onClick={() => setViewMode('cards')}
              size="sm"
            >
              Cards
            </Button>
            <Button 
              variant={viewMode === 'table' ? "default" : "outline"} 
              onClick={() => setViewMode('table')}
              size="sm"
            >
              Table
            </Button>
          </div>
          <Button onClick={handleOpenDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add New Instructor
          </Button>
        </div>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search instructors by name, specialization, subject or company"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredInstructors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No instructors found. Add one to get started.</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map(instructor => (
            <InstructorCard 
              key={instructor.id}
              instructor={instructor}
              onEdit={startEdit}
              onDelete={handleDeleteInstructor}
            />
          ))}
        </div>
      ) : (
        <InstructorTable 
          instructors={filteredInstructors} 
          onEdit={startEdit} 
          onDelete={handleDeleteInstructor} 
        />
      )}

      <InstructorFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        instructor={editInstructor}
        onSave={handleSaveInstructor}
      />
    </div>
  );
};

export default InstructorDetails;
