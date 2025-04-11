
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Instructor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  company: string;
  notes: string;
  specialization: string[];
  imageUrl?: string;
};

// Mock data for instructors
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

const InstructorDetails = () => {
  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const savedInstructors = localStorage.getItem('instructors');
    return savedInstructors ? JSON.parse(savedInstructors) : initialInstructors;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
  const [newInstructor, setNewInstructor] = useState<Omit<Instructor, 'id'>>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    company: '',
    notes: '',
    specialization: [],
    imageUrl: ''
  });
  const [newSpecialization, setNewSpecialization] = useState('');

  // Save to localStorage whenever instructors change
  React.useEffect(() => {
    localStorage.setItem('instructors', JSON.stringify(instructors));
  }, [instructors]);

  const filteredInstructors = instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    instructor.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
    instructor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.company.toLowerCase().includes(searchQuery.toLowerCase())
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
      phone: '',
      subject: '',
      company: '',
      notes: '',
      specialization: [],
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
        <div className="flex items-center gap-4">
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
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input 
                    id="phone" 
                    value={editInstructor ? editInstructor.phone : newInstructor.phone} 
                    onChange={(e) => editInstructor 
                      ? handleEditInstructorChange('phone', e.target.value) 
                      : handleNewInstructorChange('phone', e.target.value)
                    } 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input 
                    id="subject" 
                    value={editInstructor ? editInstructor.subject : newInstructor.subject} 
                    onChange={(e) => editInstructor 
                      ? handleEditInstructorChange('subject', e.target.value) 
                      : handleNewInstructorChange('subject', e.target.value)
                    } 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">Company</label>
                  <Input 
                    id="company" 
                    value={editInstructor ? editInstructor.company : newInstructor.company} 
                    onChange={(e) => editInstructor 
                      ? handleEditInstructorChange('company', e.target.value) 
                      : handleNewInstructorChange('company', e.target.value)
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
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <textarea 
                    id="notes" 
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    value={editInstructor ? editInstructor.notes : newInstructor.notes} 
                    onChange={(e) => editInstructor 
                      ? handleEditInstructorChange('notes', e.target.value) 
                      : handleNewInstructorChange('notes', e.target.value)
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
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Phone:</p>
                    <p className="text-sm">{instructor.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Subject:</p>
                    <p className="text-sm">{instructor.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Company:</p>
                    <p className="text-sm">{instructor.company}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Specializations:</p>
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {instructor.notes && (
                    <div>
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm italic">{instructor.notes}</p>
                    </div>
                  )}
                </div>
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
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Specializations</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstructors.map(instructor => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
                        <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {instructor.name}
                    </div>
                  </TableCell>
                  <TableCell>{instructor.email}</TableCell>
                  <TableCell>{instructor.phone}</TableCell>
                  <TableCell>{instructor.subject}</TableCell>
                  <TableCell>{instructor.company}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm italic">{instructor.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(instructor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteInstructor(instructor.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default InstructorDetails;
