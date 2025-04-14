
import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Instructor } from '@/types/instructor';
import InstructorCard from '@/components/instructor/InstructorCard';
import InstructorTable from '@/components/instructor/InstructorTable';
import InstructorFormDialog from '@/components/instructor/InstructorFormDialog';
import { useToast } from '@/hooks/use-toast';

const initialInstructors: Instructor[] = [
  { 
    id: 'instructor-1', 
    name: 'John Smith', 
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    subject: 'Digital Art',
    company: 'Creative Design Studios',
    notes: 'Available on weekends only',
    specialization: ['Digital Painting', 'Illustration'],
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  { 
    id: 'instructor-2', 
    name: 'Maria Johnson', 
    email: 'maria.johnson@example.com',
    phone: '+1 (555) 987-6543',
    subject: 'Animation',
    company: 'Animated World Inc.',
    notes: '',
    specialization: ['Character Design', 'Animation'],
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  { 
    id: 'instructor-3', 
    name: 'Robert Chen', 
    email: 'robert.chen@example.com',
    phone: '+1 (555) 333-2222',
    subject: 'UI/UX Design',
    company: 'Interface Masters',
    notes: 'Part-time availability',
    specialization: ['UI/UX Design', 'Web Design'],
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  { 
    id: 'instructor-4', 
    name: 'Sarah Davis', 
    email: 'sarah.davis@example.com',
    phone: '+1 (555) 444-5555',
    subject: '3D Modeling',
    company: 'GameArt Studios',
    notes: '',
    specialization: ['3D Modeling', 'Game Art'],
    imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
];

const InstructorDetails: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const savedInstructors = localStorage.getItem('instructors');
    return savedInstructors ? JSON.parse(savedInstructors) : initialInstructors;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
  const { toast } = useToast();

  // Save instructors to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem('instructors', JSON.stringify(instructors));
  }, [instructors]);

  // Memoize filtered instructors for performance
  const filteredInstructors = useMemo(() => instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    instructor.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
    instructor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.company.toLowerCase().includes(searchQuery.toLowerCase())
  ), [instructors, searchQuery]);

  const handleAddInstructor = useCallback((newInstructor: Partial<Instructor>) => {
    const instructorWithId = {
      ...newInstructor,
      id: `instructor-${Date.now()}`
    } as Instructor;
    
    setInstructors(prev => [...prev, instructorWithId]);
    toast({
      title: "Instructor Added",
      description: `${newInstructor.name} has been added successfully.`,
    });
  }, [toast]);

  const handleEditInstructor = useCallback((updatedInstructor: Partial<Instructor>) => {
    if (!editInstructor) return;
    
    setInstructors(prev => prev.map(instructor => 
      instructor.id === editInstructor.id 
        ? { ...instructor, ...updatedInstructor } 
        : instructor
    ));
    
    toast({
      title: "Instructor Updated",
      description: `${updatedInstructor.name} has been updated successfully.`,
    });
    
    setEditInstructor(null);
  }, [editInstructor, toast]);

  const handleDeleteInstructor = useCallback((id: string) => {
    const instructorToDelete = instructors.find(i => i.id === id);
    
    setInstructors(prev => prev.filter(instructor => instructor.id !== id));
    
    toast({
      title: "Instructor Removed",
      description: `${instructorToDelete?.name} has been removed.`,
      variant: "destructive",
    });
  }, [instructors, toast]);

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
      
      {viewMode === 'cards' ? (
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
