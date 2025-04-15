
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/types/schedule';

interface CourseProgressBarProps {
  course: Course;
}

const CourseProgressBar: React.FC<CourseProgressBarProps> = ({ course }) => {
  const getSessionProgress = (course: Course) => {
    // Ensure these values are numbers by using Number() conversion
    const scheduledSessions = Number(course.scheduledSessions) || 0;
    const numberOfSessions = Number(course.numberOfSessions) || 0;
    
    const progressPercentage = numberOfSessions > 0 
      ? Math.min(100, Math.round((scheduledSessions / numberOfSessions) * 100)) 
      : 0;
    
    return {
      scheduled: scheduledSessions,
      total: numberOfSessions,
      percentage: progressPercentage
    };
  };

  const progress = getSessionProgress(course);

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span>Progress:</span>
        <span>{progress.scheduled} of {progress.total} sessions scheduled ({progress.percentage}%)</span>
      </div>
      <Progress value={progress.percentage} className="h-2" />
    </div>
  );
};

export default CourseProgressBar;
