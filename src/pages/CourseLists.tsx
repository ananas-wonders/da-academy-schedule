
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

type Course = {
  id: string;
  courseCode: string;
  term: string;
  title: string;
  lectureHours: number;
  labHours: number;
  selfStudyHours: number;
  totalHours: number;
  numberOfSessions: number;
  status: 'scheduled' | 'partially-scheduled' | 'not-scheduled';
  category: string;
  notes: string;
  trackId: string;
};

// Mock data for courses
const initialCourses: Course[] = [
  { 
    id: 'course-1', 
    courseCode: 'DA101',
    term: 'Fall 2024',
    title: 'Introduction to Digital Art', 
    lectureHours: 20,
    labHours: 10, 
    selfStudyHours: 15, 
    totalHours: 45, 
    numberOfSessions: 15,
    status: 'scheduled',
    category: 'Fundamentals',
    notes: 'Required for all students',
    trackId: 'track-1', 
  },
  { 
    id: 'course-2', 
    courseCode: 'DA102',
    term: 'Fall 2024',
    title: 'Color Theory Fundamentals', 
    lectureHours: 15,
    labHours: 10, 
    selfStudyHours: 10, 
    totalHours: 35, 
    numberOfSessions: 12,
    status: 'partially-scheduled',
    category: 'Fundamentals',
    notes: '',
    trackId: 'track-1', 
  },
  { 
    id: 'course-3', 
    courseCode: 'DA201',
    term: 'Fall 2024',
    title: 'Digital Composition', 
    lectureHours: 18,
    labHours: 15, 
    selfStudyHours: 12, 
    totalHours: 45, 
    numberOfSessions: 15,
    status: 'not-scheduled',
    category: 'Intermediate',
    notes: 'Prerequisite: DA101',
    trackId: 'track-2', 
  },
  // ... keep existing code (remaining courses)
];

const trackOptions = [
  { id: 'track-1', name: 'Beginner Course' },
  { id: 'track-2', name: 'Intermediate' },
  { id: 'track-3', name: 'Advanced Course' },
  { id: 'track-4', name: 'Expert Racing' }
];

const CourseLists = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('courses');
    return savedCourses ? JSON.parse(savedCourses) : initialCourses;
  });
  const [activeTrack, setActiveTrack] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    courseCode: '',
    term: 'Fall 2024',
    title: '',
    lectureHours: 0,
    labHours: 0,
    selfStudyHours: 0,
    totalHours: 0,
    numberOfSessions: 0,
    status: 'not-scheduled',
    category: '',
    notes: '',
    trackId: 'track-1'
  });
  const [sessionCounts, setSessionCounts] = useState<{[courseTitle: string]: number}>({});

  // Load session counts from the sessions data
  useEffect(() => {
    const loadSessionData = () => {
      try {
        const sessionsData = JSON.parse(localStorage.getItem('sessions') || '[]');
        
        // Count sessions per course title
        const counts: {[courseTitle: string]: number} = {};
        
        sessionsData.forEach((session: any) => {
          if (session.title) {
            counts[session.title] = (counts[session.title] || 0) + 1;
          }
        });
        
        setSessionCounts(counts);
      } catch (e) {
        console.error('Error loading session data:', e);
      }
    };
    
    loadSessionData();
  }, []);

  // Save to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const filteredCourses = activeTrack === 'all' 
    ? courses 
    : courses.filter(course => course.trackId === activeTrack);

  const getSessionProgress = (course: Course) => {
    const scheduledSessions = sessionCounts[course.title] || 0;
    const progressPercentage = course.numberOfSessions > 0 
      ? Math.min(100, Math.round((scheduledSessions / course.numberOfSessions) * 100)) 
      : 0;
    
    return {
      scheduled: scheduledSessions,
      total: course.numberOfSessions,
      percentage: progressPercentage
    };
  };

  const handleAddCourse = () => {
    // Calculate total hours and number of sessions
    const totalHours = Number(newCourse.lectureHours) + Number(newCourse.labHours) + Number(newCourse.selfStudyHours);
    const numberOfSessions = Math.ceil(totalHours / 3);

    const newCourseWithId = {
      ...newCourse,
      id: `course-${Date.now()}`,
      totalHours,
      numberOfSessions
    };
    
    setCourses([...courses, newCourseWithId]);
    setDialogOpen(false);
    resetForm();
  };

  const handleEditCourse = () => {
    if (!editCourse) return;
    
    // Recalculate totals
    const totalHours = Number(editCourse.lectureHours) + Number(editCourse.labHours) + Number(editCourse.selfStudyHours);
    const numberOfSessions = Math.ceil(totalHours / 3);
    
    const updatedCourse = {
      ...editCourse,
      totalHours,
      numberOfSessions
    };
    
    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    
    setDialogOpen(false);
    setEditCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const resetForm = () => {
    setNewCourse({
      courseCode: '',
      term: 'Fall 2024',
      title: '',
      lectureHours: 0,
      labHours: 0,
      selfStudyHours: 0,
      totalHours: 0,
      numberOfSessions: 0,
      status: 'not-scheduled',
      category: '',
      notes: '',
      trackId: 'track-1'
    });
  };

  const startEdit = (course: Course) => {
    setEditCourse(course);
    setDialogOpen(true);
  };

  const handleNewCourseChange = (field: keyof Omit<Course, 'id'>, value: any) => {
    setNewCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleEditCourseChange = (field: keyof Course, value: any) => {
    if (!editCourse) return;
    setEditCourse({ ...editCourse, [field]: value });
  };

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'scheduled': return 'text-green-600';
      case 'partially-scheduled': return 'text-amber-600';
      case 'not-scheduled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Lists</h1>
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
                setEditCourse(null);
                resetForm();
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                <DialogDescription>
                  {editCourse 
                    ? 'Edit course details below'
                    : 'Fill in the course details below to add a new course.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="courseCode" className="text-sm font-medium">Course Code</label>
                    <Input 
                      id="courseCode" 
                      value={editCourse ? editCourse.courseCode : newCourse.courseCode} 
                      onChange={(e) => editCourse 
                        ? handleEditCourseChange('courseCode', e.target.value) 
                        : handleNewCourseChange('courseCode', e.target.value)
                      } 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="term" className="text-sm font-medium">Term</label>
                    <Input 
                      id="term" 
                      value={editCourse ? editCourse.term : newCourse.term} 
                      onChange={(e) => editCourse 
                        ? handleEditCourseChange('term', e.target.value) 
                        : handleNewCourseChange('term', e.target.value)
                      } 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Course Title</label>
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
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input 
                      id="category" 
                      value={editCourse ? editCourse.category : newCourse.category} 
                      onChange={(e) => editCourse 
                        ? handleEditCourseChange('category', e.target.value) 
                        : handleNewCourseChange('category', e.target.value)
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
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="lectureHours" className="text-sm font-medium">Lecture Hours</label>
                      <Input 
                        id="lectureHours" 
                        type="number"
                        min="0"
                        value={editCourse ? editCourse.lectureHours : newCourse.lectureHours} 
                        onChange={(e) => editCourse 
                          ? handleEditCourseChange('lectureHours', Number(e.target.value)) 
                          : handleNewCourseChange('lectureHours', Number(e.target.value))
                        } 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="labHours" className="text-sm font-medium">Lab Hours</label>
                      <Input 
                        id="labHours" 
                        type="number"
                        min="0"
                        value={editCourse ? editCourse.labHours : newCourse.labHours} 
                        onChange={(e) => editCourse 
                          ? handleEditCourseChange('labHours', Number(e.target.value)) 
                          : handleNewCourseChange('labHours', Number(e.target.value))
                        } 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="selfStudyHours" className="text-sm font-medium">Self-Study Hours</label>
                      <Input 
                        id="selfStudyHours" 
                        type="number"
                        min="0"
                        value={editCourse ? editCourse.selfStudyHours : newCourse.selfStudyHours} 
                        onChange={(e) => editCourse 
                          ? handleEditCourseChange('selfStudyHours', Number(e.target.value)) 
                          : handleNewCourseChange('selfStudyHours', Number(e.target.value))
                        } 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="totalHours" className="text-sm font-medium">Total Hours (calculated)</label>
                      <Input 
                        id="totalHours" 
                        readOnly
                        value={editCourse 
                          ? Number(editCourse.lectureHours) + Number(editCourse.labHours) + Number(editCourse.selfStudyHours)
                          : Number(newCourse.lectureHours) + Number(newCourse.labHours) + Number(newCourse.selfStudyHours)
                        } 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="numberOfSessions" className="text-sm font-medium">Number of Sessions (calculated)</label>
                      <Input 
                        id="numberOfSessions" 
                        readOnly
                        value={editCourse 
                          ? Math.ceil((Number(editCourse.lectureHours) + Number(editCourse.labHours) + Number(editCourse.selfStudyHours)) / 3)
                          : Math.ceil((Number(newCourse.lectureHours) + Number(newCourse.labHours) + Number(newCourse.selfStudyHours)) / 3)
                        } 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <select 
                      id="status"
                      className="w-full p-2 border rounded-md"
                      value={editCourse ? editCourse.status : newCourse.status}
                      onChange={(e) => editCourse 
                        ? handleEditCourseChange('status', e.target.value) 
                        : handleNewCourseChange('status', e.target.value as Course['status'])
                      }
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="partially-scheduled">Partially Scheduled</option>
                      <option value="not-scheduled">Not Scheduled</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                    <textarea 
                      id="notes" 
                      className="w-full p-2 border rounded-md h-20"
                      value={editCourse ? editCourse.notes : newCourse.notes} 
                      onChange={(e) => editCourse 
                        ? handleEditCourseChange('notes', e.target.value) 
                        : handleNewCourseChange('notes', e.target.value)
                      } 
                    />
                  </div>
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
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTrack}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tracks</TabsTrigger>
          {trackOptions.map(track => (
            <TabsTrigger key={track.id} value={track.id}>{track.name}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTrack} className="mt-0">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                const progress = getSessionProgress(course);
                return (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>
                            {course.courseCode} - {course.term}
                          </CardDescription>
                        </div>
                        <div className={`text-sm font-medium ${getStatusColor(course.status)}`}>
                          {course.status.replace('-', ' ')}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{course.category}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Track:</span>
                          <span className="font-medium">{trackOptions.find(t => t.id === course.trackId)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hours:</span>
                          <span className="font-medium">L: {course.lectureHours}, Lab: {course.labHours}, Self: {course.selfStudyHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Hours:</span>
                          <span className="font-medium">{course.totalHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sessions:</span>
                          <span className="font-medium">{course.numberOfSessions}</span>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress:</span>
                            <span>{progress.scheduled} of {progress.total} sessions scheduled ({progress.percentage}%)</span>
                          </div>
                          <Progress value={progress.percentage} className="h-2" />
                        </div>
                      </div>
                      
                      {course.notes && <p className="text-sm italic mt-4">{course.notes}</p>}
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
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Hours (L/Lab/Self)</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map(course => {
                    const progress = getSessionProgress(course);
                    return (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.courseCode}</TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{trackOptions.find(t => t.id === course.trackId)?.name}</TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.term}</TableCell>
                        <TableCell>{course.lectureHours}/{course.labHours}/{course.selfStudyHours}</TableCell>
                        <TableCell>{course.totalHours}</TableCell>
                        <TableCell>{course.numberOfSessions}</TableCell>
                        <TableCell className={getStatusColor(course.status)}>
                          {course.status.replace('-', ' ')}
                        </TableCell>
                        <TableCell className="w-40">
                          <div className="flex flex-col">
                            <span className="text-xs mb-1">{progress.scheduled}/{progress.total} ({progress.percentage}%)</span>
                            <Progress value={progress.percentage} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(course)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseLists;
