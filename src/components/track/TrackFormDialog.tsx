
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Track } from '@/types/track';

interface TrackFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: Partial<Track> | null;
  onSave: (track: Partial<Track>) => void;
}

const TrackFormDialog: React.FC<TrackFormDialogProps> = ({
  open,
  onOpenChange,
  track,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Track>>(
    track || {
      programName: '',
      code: '',
      supervisor: '',
      deputySupervisor: '',
      studentsCount: 0,
      studentCoordinator: '',
      teamsLink: '',
      assignmentFolder: '',
      gradeSheet: '',
      attendanceForm: '',
      telegramGeneralGroup: '',
      telegramCourseGroup: ''
    }
  );

  useEffect(() => {
    if (open) {
      setFormData(track || {
        programName: '',
        code: '',
        supervisor: '',
        deputySupervisor: '',
        studentsCount: 0,
        studentCoordinator: '',
        teamsLink: '',
        assignmentFolder: '',
        gradeSheet: '',
        attendanceForm: '',
        telegramGeneralGroup: '',
        telegramCourseGroup: ''
      });
    }
  }, [track, open]);

  const handleChange = (field: keyof Track, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[700px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{track ? 'Edit Track' : 'Add New Track'}</DialogTitle>
          <DialogDescription>
            {track 
              ? 'Edit track details below'
              : 'Fill in the track details below to add to the database.'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="space-y-4 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input 
                  id="programName" 
                  value={formData.programName || ''} 
                  onChange={(e) => handleChange('programName', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input 
                  id="code" 
                  value={formData.code || ''} 
                  onChange={(e) => handleChange('code', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor</Label>
                <Input 
                  id="supervisor" 
                  value={formData.supervisor || ''} 
                  onChange={(e) => handleChange('supervisor', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deputySupervisor">Deputy Supervisor</Label>
                <Input 
                  id="deputySupervisor" 
                  value={formData.deputySupervisor || ''} 
                  onChange={(e) => handleChange('deputySupervisor', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentsCount">Students Count</Label>
                <Input 
                  id="studentsCount" 
                  type="number"
                  min="0"
                  value={formData.studentsCount || 0} 
                  onChange={(e) => handleChange('studentsCount', parseInt(e.target.value) || 0)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentCoordinator">Student Coordinator</Label>
                <Input 
                  id="studentCoordinator" 
                  value={formData.studentCoordinator || ''} 
                  onChange={(e) => handleChange('studentCoordinator', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="pt-2 pb-1">
              <h3 className="text-sm font-semibold mb-2">Links & Resources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamsLink">Teams Link</Label>
                  <Input 
                    id="teamsLink" 
                    value={formData.teamsLink || ''} 
                    onChange={(e) => handleChange('teamsLink', e.target.value)} 
                    placeholder="https://teams.microsoft.com/..." 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignmentFolder">Assignment Folder</Label>
                  <Input 
                    id="assignmentFolder" 
                    value={formData.assignmentFolder || ''} 
                    onChange={(e) => handleChange('assignmentFolder', e.target.value)} 
                    placeholder="https://drive.google.com/..." 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gradeSheet">Grade Sheet</Label>
                  <Input 
                    id="gradeSheet" 
                    value={formData.gradeSheet || ''} 
                    onChange={(e) => handleChange('gradeSheet', e.target.value)} 
                    placeholder="https://drive.google.com/..." 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attendanceForm">Attendance Form</Label>
                  <Input 
                    id="attendanceForm" 
                    value={formData.attendanceForm || ''} 
                    onChange={(e) => handleChange('attendanceForm', e.target.value)} 
                    placeholder="https://forms.google.com/..." 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telegramGeneralGroup">Telegram General Group</Label>
                  <Input 
                    id="telegramGeneralGroup" 
                    value={formData.telegramGeneralGroup || ''} 
                    onChange={(e) => handleChange('telegramGeneralGroup', e.target.value)} 
                    placeholder="https://t.me/..." 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telegramCourseGroup">Telegram Course Group</Label>
                  <Input 
                    id="telegramCourseGroup" 
                    value={formData.telegramCourseGroup || ''} 
                    onChange={(e) => handleChange('telegramCourseGroup', e.target.value)} 
                    placeholder="https://t.me/..." 
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {track ? 'Save Changes' : 'Add Track'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrackFormDialog;
