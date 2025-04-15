
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Course } from '@/types/schedule';
import CourseProgressBar from './CourseProgressBar';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  tracks: {id: string, name: string}[];
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete, tracks }) => {
  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'scheduled': return 'text-green-600';
      case 'partially-scheduled': return 'text-amber-600';
      case 'not-scheduled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
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
            <span className="font-medium">{tracks.find(t => t.id === course.trackId)?.name}</span>
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
          
          <CourseProgressBar course={course} />
        </div>
        
        {course.notes && <p className="text-sm italic mt-4">{course.notes}</p>}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(course.id)}>
          <Trash className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
