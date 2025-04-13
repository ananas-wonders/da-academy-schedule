
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  tags: string[];
};

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Course) => void;
  editCourse: Course | null;
}

const CourseDialog: React.FC<CourseDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  editCourse 
}) => {
  const [course, setCourse] = useState<Course>({
    id: '',
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: 4,
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (editCourse) {
      setCourse(editCourse);
    } else {
      setCourse({
        id: `course-${Date.now()}`,
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        duration: 4,
        tags: []
      });
    }
  }, [editCourse, open]);

  const handleChange = (field: keyof Course, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setCourse(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setCourse(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    onSave(course);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          <DialogDescription>
            {editCourse 
              ? 'Edit course details below' 
              : 'Fill in the course details below to add to the catalog.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={course.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Introduction to Digital Art"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={course.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="A comprehensive introduction to digital art fundamentals..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={course.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Art & Design"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  value={course.level}
                  onChange={(e) => handleChange('level', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={course.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag"
                />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-gray-300 p-1 h-4 w-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editCourse ? 'Update Course' : 'Add Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialog;
