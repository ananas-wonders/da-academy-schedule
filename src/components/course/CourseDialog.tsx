
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
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { X, Plus, Book } from "lucide-react";

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
      <DialogContent className="sm:max-w-[95vw] md:max-w-[600px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 flex flex-row items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Book className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <DialogTitle className="text-xl">{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription>
              {editCourse 
                ? 'Edit course details below' 
                : 'Fill in the course details below to add to the catalog.'}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="space-y-5 px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Course Title</Label>
              <Input
                id="title"
                value={course.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Introduction to Digital Art"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={course.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="A comprehensive introduction to digital art fundamentals..."
                rows={4}
                className="resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                <Input
                  id="category"
                  value={course.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="Art & Design"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">Level</Label>
                <Select 
                  value={course.level} 
                  onValueChange={(value) => handleChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={course.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 1)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm" variant="secondary">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-primary/5 pl-3 pr-2 py-1.5">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-gray-300 p-0.5 flex items-center justify-center"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            {editCourse ? 'Update Course' : 'Add Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialog;
