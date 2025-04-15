
import React from 'react';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  return (
    <>
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
              {tracks.map(track => (
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
          
          {editCourse && (
            <div className="space-y-2">
              <label htmlFor="scheduledSessions" className="text-sm font-medium">Scheduled Sessions</label>
              <Input 
                id="scheduledSessions" 
                type="number"
                min="0"
                value={editCourse.scheduledSessions} 
                onChange={(e) => handleEditCourseChange('scheduledSessions', Number(e.target.value))} 
              />
            </div>
          )}
          
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
    </>
  );
};

export default CourseForm;
