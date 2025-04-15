
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/types/schedule';
import CourseProgressBar from './CourseProgressBar';

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  tracks: {id: string, name: string}[];
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, onEdit, onDelete, tracks }) => {
  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'scheduled': return 'text-green-600';
      case 'partially-scheduled': return 'text-amber-600';
      case 'not-scheduled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSessionProgress = (course: Course) => {
    const progressPercentage = course.numberOfSessions > 0 
      ? Math.min(100, Math.round((course.scheduledSessions / course.numberOfSessions) * 100)) 
      : 0;
    
    return {
      scheduled: course.scheduledSessions,
      total: course.numberOfSessions,
      percentage: progressPercentage
    };
  };

  return (
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
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                No courses found for this track.
              </TableCell>
            </TableRow>
          ) : (
            courses.map(course => {
              const progress = getSessionProgress(course);
              return (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.courseCode}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{tracks.find(t => t.id === course.trackId)?.name}</TableCell>
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
                    <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(course.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
