
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ExternalLink } from 'lucide-react';
import { Track } from '@/types/track';
import { Badge } from '@/components/ui/badge';

interface TrackTableProps {
  tracks: Track[];
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
}

const TrackTable: React.FC<TrackTableProps> = ({ tracks, onEdit, onDelete }) => {
  const renderLink = (url?: string, label: string = 'Link') => {
    if (!url) return 'N/A';
    
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1"
      >
        {label} <ExternalLink className="h-3 w-3" />
      </a>
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Resources</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No tracks found
                </TableCell>
              </TableRow>
            ) : (
              tracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell className="font-medium">
                    {track.programName}
                  </TableCell>
                  <TableCell>{track.code}</TableCell>
                  <TableCell>
                    {track.groupName ? (
                      <Badge 
                        variant="outline" 
                        style={{ 
                          borderColor: track.groupColor || undefined,
                          color: track.groupColor || undefined 
                        }}
                      >
                        {track.groupName}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {track.supervisor}
                    {track.deputySupervisor && (
                      <div className="text-xs text-muted-foreground">
                        Deputy: {track.deputySupervisor}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{track.studentsCount}</TableCell>
                  <TableCell>
                    {renderLink(track.teamsLink, 'Teams')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {track.assignmentFolder && (
                        <div>{renderLink(track.assignmentFolder, 'Assignments')}</div>
                      )}
                      {track.gradeSheet && (
                        <div>{renderLink(track.gradeSheet, 'Grades')}</div>
                      )}
                      {track.attendanceForm && (
                        <div>{renderLink(track.attendanceForm, 'Attendance')}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(track)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(track.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrackTable;
