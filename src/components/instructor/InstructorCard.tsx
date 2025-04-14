
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, MessageCircle } from 'lucide-react';
import { Instructor } from '@/types/instructor';

interface InstructorCardProps {
  instructor: Instructor;
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ 
  instructor, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
          <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex justify-between items-center w-full">
          <div>
            <h3 className="text-xl font-semibold">{instructor.name}</h3>
            <p className="text-sm text-gray-500">{instructor.email}</p>
          </div>
          {instructor.phone && (
            <a 
              href={`https://api.whatsapp.com/send?phone=${instructor.phone.replace(/\D/g, '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-700"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Phone:</p>
            <p className="text-sm">{instructor.phone}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Subject:</p>
            <p className="text-sm">{instructor.subject}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Company:</p>
            <p className="text-sm">{instructor.company}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Specializations:</p>
            <div className="flex flex-wrap gap-1">
              {instructor.specialization.map((spec, index) => (
                <Badge key={index} variant="secondary">{spec}</Badge>
              ))}
            </div>
          </div>
          
          {instructor.notes && (
            <div>
              <p className="text-sm font-medium">Notes:</p>
              <p className="text-sm italic">{instructor.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(instructor)}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(instructor.id)}>
          <Trash className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InstructorCard;
