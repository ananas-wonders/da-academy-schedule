
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, LayoutList, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/schedule';
import CourseCard from '@/components/course/CourseCard';
import CourseTable from '@/components/course/CourseTable';
import CourseForm from '@/components/course/CourseForm';

type CourseDB = {
  id: string;
  course_code: string | null;
  term: string | null;
  title: string;
  lecture_hours: number | null;
  lab_hours: number | null;
  self_study_hours: number | null;
  total_hours: number | null;
  number_of_sessions: number | null;
  scheduled_sessions: number | null;
  status: 'scheduled' | 'partially-scheduled' | 'not-scheduled' | null;
  category: string | null;
  notes: string | null;
  track_id: string | null;
  created_at: string;
  updated_at: string;
  description?: string | null;
  duration?: number | null;
}

const CourseLists = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tracks, setTracks] = useState<{id: string, name: string}[]>([]);
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
    scheduledSessions: 0,
    status: 'not-scheduled',
    category: '',
    notes: '',
    trackId: ''
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { data: trackData, error: trackError } = await supabase
          .from('tracks')
          .select('id, name')
          .order('name');
        
        if (trackError) throw trackError;
        
        setTracks(trackData);
        
        if (trackData.length > 0) {
          setActiveTrack('all');
          setNewCourse(prev => ({ ...prev, trackId: trackData[0].id }));
        }
        
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*');
        
        if (courseError) throw courseError;
        
        const formattedCourses: Course[] = courseData.map((course: any) => ({
          id: course.id,
          courseCode: course.course_code || '',
          title: course.title,
          term: course.term || '',
          lectureHours: course.lecture_hours || 0,
          labHours: course.lab_hours || 0,
          selfStudyHours: course.self_study_hours || 0,
          totalHours: course.total_hours || 0,
          numberOfSessions: course.number_of_sessions || 0,
          scheduledSessions: course.scheduled_sessions || 0,
          status: course.status || 'not-scheduled',
          category: course.category || '',
          notes: course.notes || '',
          trackId: course.track_id || ''
        }));
        
        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    const courseSubscription = supabase
      .channel('courses-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'courses' }, 
        (payload) => {
          console.log('Course change detected:', payload);
          supabase
            .from('courses')
            .select('*')
            .then(({ data, error }) => {
              if (error) {
                console.error('Error refreshing courses:', error);
                return;
              }
              
              if (data) {
                const formattedCourses: Course[] = data.map((course: any) => ({
                  id: course.id,
                  courseCode: course.course_code || '',
                  title: course.title,
                  term: course.term || '',
                  lectureHours: course.lecture_hours || 0,
                  labHours: course.lab_hours || 0,
                  selfStudyHours: course.self_study_hours || 0,
                  totalHours: course.total_hours || 0,
                  numberOfSessions: course.number_of_sessions || 0,
                  scheduledSessions: course.scheduled_sessions || 0,
                  status: course.status || 'not-scheduled',
                  category: course.category || '',
                  notes: course.notes || '',
                  trackId: course.track_id || ''
                }));
                
                setCourses(formattedCourses);
              }
            });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(courseSubscription);
    };
  }, [toast]);

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const { data: sessionsData, error } = await supabase
          .from('sessions')
          .select('title');
        
        if (error) throw error;
        
        const counts: {[courseTitle: string]: number} = {};
        
        sessionsData.forEach((session: any) => {
          if (session.title) {
            counts[session.title] = (counts[session.title] || 0) + 1;
          }
        });
        
        const updatedCourses = courses.map(course => {
          const scheduledSessions = counts[course.title] || 0;
          return {
            ...course,
            scheduledSessions,
            status: getStatus(scheduledSessions, course.numberOfSessions)
          };
        });
        
        setCourses(updatedCourses);
        
        updatedCourses.forEach(async (course) => {
          if (course.scheduledSessions !== 0) {
            await supabase
              .from('courses')
              .update({
                scheduled_sessions: course.scheduledSessions,
                status: course.status
              })
              .eq('id', course.id);
          }
        });
      } catch (e) {
        console.error('Error loading session data:', e);
      }
    };
    
    if (courses.length > 0) {
      loadSessionData();
    }
  }, [courses]);

  const getStatus = (scheduled: number, total: number): Course['status'] => {
    if (scheduled === 0) return 'not-scheduled';
    if (scheduled < total) return 'partially-scheduled';
    return 'scheduled';
  };

  const filteredCourses = activeTrack === 'all' 
    ? courses 
    : courses.filter(course => course.trackId === activeTrack);

  const handleAddCourse = async () => {
    try {
      const totalHours = Number(newCourse.lectureHours) + Number(newCourse.labHours) + Number(newCourse.selfStudyHours);
      const numberOfSessions = Math.ceil(totalHours / 3);
      
      const courseData: CourseDB = {
        id: `course-${Date.now()}`,
        course_code: newCourse.courseCode,
        title: newCourse.title,
        term: newCourse.term,
        lecture_hours: Number(newCourse.lectureHours),
        lab_hours: Number(newCourse.labHours),
        self_study_hours: Number(newCourse.selfStudyHours),
        total_hours: totalHours,
        number_of_sessions: numberOfSessions,
        scheduled_sessions: 0,
        status: 'not-scheduled',
        category: newCourse.category,
        notes: newCourse.notes,
        track_id: newCourse.trackId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('courses')
        .insert([courseData]);
      
      if (error) throw error;
      
      const newCourseWithId: Course = {
        id: courseData.id,
        ...newCourse,
        totalHours,
        numberOfSessions,
        scheduledSessions: 0
      };
      
      setCourses([...courses, newCourseWithId]);
      setDialogOpen(false);
      resetForm();
      
      toast({
        title: "Course Added",
        description: `${newCourse.title} has been added successfully.`
      });
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add course."
      });
    }
  };

  const handleEditCourse = async () => {
    if (!editCourse) return;
    
    try {
      const totalHours = Number(editCourse.lectureHours) + Number(editCourse.labHours) + Number(editCourse.selfStudyHours);
      const numberOfSessions = Math.ceil(totalHours / 3);
      
      const status = getStatus(editCourse.scheduledSessions, numberOfSessions);
      
      const courseData = {
        course_code: editCourse.courseCode,
        title: editCourse.title,
        term: editCourse.term,
        lecture_hours: Number(editCourse.lectureHours),
        lab_hours: Number(editCourse.labHours),
        self_study_hours: Number(editCourse.selfStudyHours),
        total_hours: totalHours,
        number_of_sessions: numberOfSessions,
        scheduled_sessions: editCourse.scheduledSessions,
        status,
        category: editCourse.category,
        notes: editCourse.notes,
        track_id: editCourse.trackId,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editCourse.id);
      
      if (error) throw error;
      
      const updatedCourse = {
        ...editCourse,
        totalHours,
        numberOfSessions,
        status
      };
      
      setCourses(courses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      ));
      
      setDialogOpen(false);
      setEditCourse(null);
      
      toast({
        title: "Course Updated",
        description: `${editCourse.title} has been updated successfully.`
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update course."
      });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const courseToDelete = courses.find(course => course.id === id);
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCourses(courses.filter(course => course.id !== id));
      
      toast({
        variant: "destructive",
        title: "Course Removed",
        description: `${courseToDelete?.title} has been removed.`
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete course."
      });
    }
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
      scheduledSessions: 0,
      status: 'not-scheduled',
      category: '',
      notes: '',
      trackId: tracks.length > 0 ? tracks[0].id : ''
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading courses data...</p>
        </div>
      </div>
    );
  }

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
              <LayoutGrid className="mr-2 h-4 w-4" /> Cards
            </Button>
            <Button 
              variant={viewMode === 'table' ? "default" : "outline"} 
              onClick={() => setViewMode('table')}
              size="sm"
            >
              <LayoutList className="mr-2 h-4 w-4" /> Table
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
              <CourseForm
                editCourse={editCourse}
                newCourse={newCourse}
                tracks={tracks}
                handleEditCourseChange={handleEditCourseChange}
                handleNewCourseChange={handleNewCourseChange}
                handleEditCourse={handleEditCourse}
                handleAddCourse={handleAddCourse}
                setDialogOpen={setDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTrack}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tracks</TabsTrigger>
          {tracks.map(track => (
            <TabsTrigger key={track.id} value={track.id}>{track.name}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTrack} className="mt-0">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No courses found for this track.
                </div>
              ) : (
                filteredCourses.map(course => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                    onEdit={startEdit}
                    onDelete={handleDeleteCourse}
                    tracks={tracks}
                  />
                ))
              )}
            </div>
          ) : (
            <CourseTable 
              courses={filteredCourses}
              onEdit={startEdit}
              onDelete={handleDeleteCourse}
              tracks={tracks}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseLists;
