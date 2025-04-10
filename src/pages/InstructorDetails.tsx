
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

type Instructor = {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  bio: string;
  imageUrl?: string;
};

// Mock data for instructors
const initialInstructors: Instructor[] = [
  { 
    id: 'instructor-1', 
    name: 'John Smith', 
    email: 'john.smith@example.com',
    specialization: ['Digital Painting', 'Illustration'],
    bio: 'Professional digital artist with 10+ years of experience in the industry.',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  { 
    id: 'instructor-2', 
    name: 'Maria Johnson', 
    email: 'maria.johnson@example.com',
    specialization: ['Character Design', 'Animation'],
    bio: 'Animation expert with background in major studios.',
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  { 
    id: 'instructor-3', 
    name: 'Robert Chen', 
    email: 'robert.chen@example.com',
    specialization: ['UI/UX Design', 'Web Design'],
    bio: 'UI/UX specialist focusing on interactive web experiences.',
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  { 
    id: 'instructor-4', 
    name: 'Sarah Davis', 
    email: 'sarah.davis@example.com',
    specialization: ['3D Modeling', 'Game Art'],
    bio: 'Game artist with experience in AAA titles and indie projects.',
    imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
];

const InstructorDetails = () => {
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
  const [newInstructor, setNewInstructor] = useState<Omit<Instructor, 'id'>>({
    name: '',
    email: '',
    specialization: [],
    bio: '',
    imageUrl: ''
  });
  const [newSpecialization, setNewSpecialization] = useState('');

  const filteredInstructors = instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    instructor.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddInstructor = () => {
    const newInstructorWithId = {
      ...newInstructor,
      id: `instructor-${Date.now()}`
    };
    setInstructors([...instructors, newInstructorWithId]);
    setDialogOpen(false);
    resetForm();
  };

  const handleEditInstructor = () => {
    if (!editInstructor) return;
    
    setInstructors(instructors.map(instructor => 
      instructor.id === editInstructor.id ? editInstructor : instructor
    ));
    setDialogOpen(false);
    setEditInstructor(null);
  };

  const handleDeleteInstructor = (id: string) => {
    setInstructors(instructors.filter(instructor => instructor.id !== id));
  };

  const resetForm = () => {
    setNewInstructor({
      name: '',
      email: '',
      specialization: [],
      bio: '',
      imageUrl: ''
    });
  };

  const startEdit = (instructor: Instructor) => {
    setEditInstructor(instructor);
    setDialogOpen(true);
  };

  const handleNewInstructorChange = (field: string, value: string | string[]) => {
    setNewInstructor(prev => ({ ...prev, [field]: value }));
  };

  const handleEditInstructorChange = (field: string, value: string | string[]) => {
    if (!editInstructor) return;
    setEditInstructor({ ...editInstructor, [field]: value });
  };

  const addSpecialization = () => {
    if (!newSpecialization.trim()) return;
    
    if (editInstructor) {
      handleEditInstructorChange('specialization', [...editInstructor.specialization, newSpecialization]);
    } else {
      handleNewInstructorChange('specialization', [...newInstructor.specialization, newSpecialization]);
    }
    setNewSpecialization('');
  };

  const removeSpecialization = (specialization: string) => {
    if (editInstructor) {
      handleEditInstructorChange(
        'specialization', 
        editInstructor.specialization.filter(s => s !== specialization)
      );
    } else {
      handleNewInstructorChange(
        'specialization', 
        newInstructor.specialization.filter(s => s !== specialization)
      );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Instructor Details</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditInstructor(null);
              resetForm();
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add New Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editInstructor ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
              <DialogDescription>
                {editInstructor 
                  ? 'Edit instructor details below'
                  : 'Fill in the instructor details below to add to the database.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name" 
                  value={editInstructor ? editInstructor.name : newInstructor.name} 
                  onChange={(e) => editInstructor 
                    ? handleEditInstructorChange('name', e.target.value) 
                    : handleNewInstructorChange('name', e.target.value)
                  } 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email"
                  value={editInstructor ? editInstructor.email : newInstructor.email} 
                  onChange={(e) => editInstructor 
                    ? handleEditInstructorChange('email', e.target.value) 
                    : handleNewInstructorChange('email', e.target.value)
                  } 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">Profile Image URL</label>
                <Input 
                  id="imageUrl" 
                  value={editInstructor ? editInstructor.imageUrl || '' : newInstructor.imageUrl || ''} 
                  onChange={(e) => editInstructor 
                    ? handleEditInstructorChange('imageUrl', e.target.value) 
                    : handleNewInstructorChange('imageUrl', e.target.value)
                  } 
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="specialization" className="text-sm font-medium">Specializations</label>
                <div className="flex space-x-2">
                  <Input 
                    id="specialization"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                    placeholder="Add specialization"
                  />
                  <Button type="button" onClick={addSpecialization}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editInstructor ? editInstructor.specialization : newInstructor.specialization).map((spec, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {spec}
                      <button 
                        onClick={() => removeSpecialization(spec)}
                        className="ml-1 rounded-full hover:bg-gray-300 p-1 h-4 w-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                <textarea 
                  id="bio" 
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={editInstructor ? editInstructor.bio : newInstructor.bio} 
                  onChange={(e) => editInstructor 
                    ? handleEditInstructorChange('bio', e.target.value) 
                    : handleNewInstructorChange('bio', e.target.value)
                  } 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={editInstructor ? handleEditInstructor : handleAddInstructor}>
                {editInstructor ? 'Save Changes' : 'Add Instructor'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search instructors by name or specialization"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map(instructor => (
          <Card key={instructor.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
                <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{instructor.name}</CardTitle>
                <p className="text-sm text-gray-500">{instructor.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Specializations:</p>
                <div className="flex flex-wrap gap-1">
                  {instructor.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm">{instructor.bio}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(instructor)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteInstructor(instructor.id)}>
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorDetails;
