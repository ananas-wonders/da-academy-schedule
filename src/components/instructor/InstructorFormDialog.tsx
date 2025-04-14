
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Instructor } from '@/types/instructor';

interface InstructorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructor: Partial<Instructor> | null;
  onSave: (instructor: Partial<Instructor>) => void;
}

const InstructorFormDialog: React.FC<InstructorFormDialogProps> = ({
  open,
  onOpenChange,
  instructor,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Instructor>>(
    instructor || {
      name: '',
      email: '',
      phone: '',
      subject: '',
      company: '',
      notes: '',
      specialization: [],
      imageUrl: ''
    }
  );
  const [newSpecialization, setNewSpecialization] = useState('');

  const handleChange = (field: keyof Instructor, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialization = () => {
    if (!newSpecialization.trim()) return;
    
    const updatedSpecializations = [
      ...(formData.specialization || []), 
      newSpecialization
    ];
    handleChange('specialization', updatedSpecializations);
    setNewSpecialization('');
  };

  const removeSpecialization = (specialization: string) => {
    const updatedSpecializations = (formData.specialization || [])
      .filter(s => s !== specialization);
    handleChange('specialization', updatedSpecializations);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      handleChange('imageUrl', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[600px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{instructor ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
          <DialogDescription>
            {instructor 
              ? 'Edit instructor details below'
              : 'Fill in the instructor details below to add to the database.'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="space-y-4 px-6 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={formData.imageUrl || ''} 
                    alt="Instructor photo" 
                  />
                  <AvatarFallback>
                    {formData.name 
                      ? formData.name.substring(0, 2).toUpperCase() 
                      : 'IN'}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                </label>
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            
            {/* Responsive form layout with grid for larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name || ''} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email || ''} 
                  onChange={(e) => handleChange('email', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone || ''} 
                  onChange={(e) => handleChange('phone', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={formData.subject || ''} 
                  onChange={(e) => handleChange('subject', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={formData.company || ''} 
                  onChange={(e) => handleChange('company', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specializations</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="specialization"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                    placeholder="Add specialization"
                  />
                  <Button type="button" onClick={addSpecialization} size="sm">Add</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.specialization || []).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {spec}
                    <button 
                      onClick={() => removeSpecialization(spec)}
                      className="ml-1 rounded-full hover:bg-gray-300 p-1 h-4 w-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                rows={3}
                value={formData.notes || ''} 
                onChange={(e) => handleChange('notes', e.target.value)} 
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {instructor ? 'Save Changes' : 'Add Instructor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorFormDialog;
