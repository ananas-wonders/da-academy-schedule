
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Course = {
  id: string;
  title: string;
  description: string;
  trackId: string;
  duration: string;
};

// Mock data for courses
const initialCourses: Course[] = [
  { id: 'course-1', title: 'Introduction to Digital Art', description: 'Basic concepts of digital art creation', trackId: 'track-1', duration: '4 weeks' },
  { id: 'course-2', title: 'Color Theory Fundamentals', description: 'Understanding color relationships', trackId: 'track-1', duration: '3 weeks' },
  { id: 'course-3', title: 'Digital Composition', description: 'Advanced composition techniques', trackId: 'track-2', duration: '6 weeks' },
  { id: 'course-4', title: 'Character Design', description: 'Creating compelling characters', trackId: 'track-2', duration: '5 weeks' },
  { id: 'course-5', title: 'Advanced Illustration', description: 'Professional illustration techniques', trackId: 'track-3', duration: '8 weeks' },
  { id: 'course-6', title: 'Portfolio Development', description: 'Building a professional digital art portfolio', trackId: 'track-4', duration: '10 weeks' }
];

const trackOptions = [
  { id: 'track-1', name: 'Beginner Course' },
  { id: 'track-2', name: 'Intermediate' },
  { id: 'track-3', name: 'Advanced Course' },
  { id: 'track-4', name: 'Expert Racing' }
];

const CourseLists = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [activeTrack, setActiveTrack] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    trackId: 'track-1',
    duration: ''
  });

  const filteredCourses = activeTrack === 'all' 
    ? courses 
    : courses.filter(course => course.trackId === activeTrack);

  const handleAddCourse = () => {
    const newCourseWithId = {
      ...newCourse,
      id: `course-${Date.now()}`
    };
    setCourses([...courses, newCourseWithId]);
    setDialogOpen(false);
    resetForm();
  };

  const handleEditCourse = () => {
    if (!editCourse) return;
    
    setCourses(courses.map(course => 
      course.id === editCourse.id ? editCourse : course
    ));
    setDialogOpen(false);
    setEditCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const resetForm = () => {
    setNewCourse({
      title: '',
      description: '',
      trackId: 'track-1',
      duration: ''
    });
  };

  const startEdit = (course: Course) => {
    setEditCourse(course);
    setDialogOpen(true);
  };

  const handleNewCourseChange = (field: string, value: string) => {
    setNewCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleEditCourseChange = (field: string, value: string) => {
    if (!editCourse) return;
    setEditCourse({ ...editCourse, [field]: value });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Lists</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditCourse(null);
              resetForm();
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              <DialogDescription>
                {editCourse 
                  ? 'Edit course details below'
                  : 'Fill in the course details below to add a new course.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input 
                  id="title" 
                  value={editCourse ? editCourse.title : newCourse.title} 
                  onChange={(e) => editCourse 
                    ? handleEditCourseChange('title', e.target.value) 
                    : handleNewCourseChange('title', e.target.value)
                  } 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input 
                  id="description" 
                  value={editCourse ? editCourse.description : newCourse.description} 
                  onChange={(e) => editCourse 
                    ? handleEditCourseChange('description', e.target.value) 
                    : handleNewCourseChange('description', e.target.value)
                  } 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="track" className="text-sm font-medium">Track</label>
                <select 
                  id="track"
                  className="w-full p-2 border rounded-md"
                  value={editCourse ? editCourse.trackId : newCourse.trackId}
                  onChange={(e) => editCourse 
                    ? handleEditCourseChange('trackId', e.target.value) 
                    : handleNewCourseChange('trackId', e.target.value)
                  }
                >
                  {trackOptions.map(track => (
                    <option key={track.id} value={track.id}>{track.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration</label>
                <Input 
                  id="duration" 
                  value={editCourse ? editCourse.duration : newCourse.duration} 
                  onChange={(e) => editCourse 
                    ? handleEditCourseChange('duration', e.target.value) 
                    : handleNewCourseChange('duration', e.target.value)
                  } 
                  placeholder="e.g., 4 weeks"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={editCourse ? handleEditCourse : handleAddCourse}>
                {editCourse ? 'Save Changes' : 'Add Course'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTrack}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tracks</TabsTrigger>
          {trackOptions.map(track => (
            <TabsTrigger key={track.id} value={track.id}>{track.name}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTrack} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    Track: {trackOptions.find(t => t.id === course.trackId)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <p className="text-sm font-semibold">Duration: {course.duration}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(course)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseLists;
