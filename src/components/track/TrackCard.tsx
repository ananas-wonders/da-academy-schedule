
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Users, ExternalLink } from 'lucide-react';
import { Track } from '@/types/track';

interface TrackCardProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onEdit, onDelete }) => {
  const renderLink = (url?: string, label: string = 'Link') => {
    if (!url) return null;
    
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
      >
        {label} <ExternalLink className="h-3 w-3" />
      </a>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{track.programName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">{track.code}</p>
              {track.groupName && (
                <Badge 
                  variant="outline" 
                  style={{ 
                    borderColor: track.groupColor || undefined,
                    color: track.groupColor || undefined 
                  }}
                >
                  {track.groupName}
                </Badge>
              )}
            </div>
          </div>
          <Badge variant="outline" className="flex items-center">
            <Users className="h-3 w-3 mr-1" /> {track.studentsCount}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Supervisor:</p>
            <p>{track.supervisor}</p>
          </div>
          
          {track.deputySupervisor && (
            <div>
              <p className="font-medium">Deputy Supervisor:</p>
              <p>{track.deputySupervisor}</p>
            </div>
          )}
          
          {track.studentCoordinator && (
            <div>
              <p className="font-medium">Student Coordinator:</p>
              <p>{track.studentCoordinator}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
            {track.teamsLink && (
              <div>{renderLink(track.teamsLink, 'Teams')}</div>
            )}
            {track.assignmentFolder && (
              <div>{renderLink(track.assignmentFolder, 'Assignments')}</div>
            )}
            {track.gradeSheet && (
              <div>{renderLink(track.gradeSheet, 'Grades')}</div>
            )}
            {track.attendanceForm && (
              <div>{renderLink(track.attendanceForm, 'Attendance')}</div>
            )}
            {track.telegramGeneralGroup && (
              <div>{renderLink(track.telegramGeneralGroup, 'General Group')}</div>
            )}
            {track.telegramCourseGroup && (
              <div>{renderLink(track.telegramCourseGroup, 'Course Group')}</div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-3">
        <Button variant="outline" size="sm" onClick={() => onEdit(track)}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(track.id)}>
          <Trash className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrackCard;
