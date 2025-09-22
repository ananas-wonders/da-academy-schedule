
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clock, Users, Target } from 'lucide-react';
import { Course } from '@/types/schedule';

interface CourseFormProps {
  editCourse: Course | null;
  newCourse: Omit<Course, 'id'>;
  tracks: { id: string, name: string }[];
  handleEditCourseChange: (field: keyof Course, value: any) => void;
  handleNewCourseChange: (field: keyof Omit<Course, 'id'>, value: any) => void;
  handleEditCourse: () => Promise<void>;
  handleAddCourse: () => Promise<void>;
  setDialogOpen: (open: boolean) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  editCourse,
  newCourse,
  tracks,
  handleEditCourseChange,
  handleNewCourseChange,
  handleEditCourse,
  handleAddCourse,
  setDialogOpen
}) => {
  const form = useForm({
    defaultValues: editCourse || newCourse,
  });

  const { watch, setValue } = form;
  const lectureHours = watch('lectureHours') || 0;
  const labHours = watch('labHours') || 0;
  const selfStudyHours = watch('selfStudyHours') || 0;
  const totalHours = Number(lectureHours) + Number(labHours) + Number(selfStudyHours);
  const numberOfSessions = Math.ceil(totalHours / 3);

  useEffect(() => {
    if (editCourse) {
      Object.keys(editCourse).forEach((key) => {
        if (key !== 'id') {
          setValue(key as keyof Omit<Course, 'id'>, editCourse[key as keyof Course]);
        }
      });
    } else {
      Object.keys(newCourse).forEach((key) => {
        setValue(key as keyof Omit<Course, 'id'>, newCourse[key as keyof Omit<Course, 'id'>]);
      });
    }
  }, [editCourse, newCourse, setValue]);

  const handleSubmit = async () => {
    const values = form.getValues();
    
    // Update the form data through the parent handlers
    Object.keys(values).forEach((key) => {
      if (editCourse) {
        handleEditCourseChange(key as keyof Course, values[key as keyof Course]);
      } else {
        handleNewCourseChange(key as keyof Omit<Course, 'id'>, values[key as keyof Omit<Course, 'id'>]);
      }
    });

    // Call the appropriate handler
    if (editCourse) {
      await handleEditCourse();
    } else {
      await handleAddCourse();
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setValue(field as any, value);
    if (editCourse) {
      handleEditCourseChange(field as keyof Course, value);
    } else {
      handleNewCourseChange(field as keyof Omit<Course, 'id'>, value);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">
                {editCourse ? 'Edit Course Details' : 'Create New Course'}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {editCourse 
                ? 'Update the course information below' 
                : 'Enter the course details to add it to your curriculum'}
            </p>
          </div>

          <Separator />

          {/* Basic Information Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Target className="h-4 w-4" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Essential course details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="courseCode"
                  render={() => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., CS101"
                          value={form.watch('courseCode') || ''}
                          onChange={(e) => handleFormChange('courseCode', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="term"
                  render={() => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Fall 2024"
                          value={form.watch('term') || ''}
                          onChange={(e) => handleFormChange('term', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="title"
                render={() => (
                  <FormItem>
                    <FormLabel>Course Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the full course title"
                        value={form.watch('title') || ''}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="category"
                  render={() => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Core, Elective"
                          value={form.watch('category') || ''}
                          onChange={(e) => handleFormChange('category', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="trackId"
                  render={() => (
                    <FormItem>
                      <FormLabel>Track</FormLabel>
                      <Select
                        value={form.watch('trackId') || ''}
                        onValueChange={(value) => handleFormChange('trackId', value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a track" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tracks.map(track => (
                            <SelectItem key={track.id} value={track.id}>
                              {track.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hours Configuration Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Clock className="h-4 w-4" />
                <span>Hours Configuration</span>
              </CardTitle>
              <CardDescription>
                Define the time allocation for different learning activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  name="lectureHours"
                  render={() => (
                    <FormItem>
                      <FormLabel>Lecture Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          placeholder="0"
                          value={form.watch('lectureHours') || 0}
                          onChange={(e) => handleFormChange('lectureHours', Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="labHours"
                  render={() => (
                    <FormItem>
                      <FormLabel>Lab Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          placeholder="0"
                          value={form.watch('labHours') || 0}
                          onChange={(e) => handleFormChange('labHours', Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="selfStudyHours"
                  render={() => (
                    <FormItem>
                      <FormLabel>Self-Study Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          placeholder="0"
                          value={form.watch('selfStudyHours') || 0}
                          onChange={(e) => handleFormChange('selfStudyHours', Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Calculated Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">Total Hours</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-sm">
                      {totalHours} hours
                    </Badge>
                    <span className="text-xs text-muted-foreground">Automatically calculated</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">Required Sessions</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-sm">
                      {numberOfSessions} sessions
                    </Badge>
                    <span className="text-xs text-muted-foreground">Based on 3 hours/session</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status and Additional Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Users className="h-4 w-4" />
                <span>Status & Additional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editCourse && (
                  <FormField
                    name="scheduledSessions"
                    render={() => (
                      <FormItem>
                        <FormLabel>Scheduled Sessions</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            value={form.watch('scheduledSessions') || 0}
                            onChange={(e) => handleFormChange('scheduledSessions', Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  name="status"
                  render={() => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={form.watch('status') || 'not-scheduled'}
                        onValueChange={(value) => handleFormChange('status', value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scheduled">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Scheduled</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="partially-scheduled">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span>Partially Scheduled</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="not-scheduled">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>Not Scheduled</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="notes"
                render={() => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional notes or comments about this course..."
                        className="min-h-[80px]"
                        value={form.watch('notes') || ''}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </Form>

      <DialogFooter className="mt-6 pt-4 border-t">
        <Button variant="outline" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="min-w-[120px]">
          {editCourse ? 'Save Changes' : 'Add Course'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default CourseForm;
