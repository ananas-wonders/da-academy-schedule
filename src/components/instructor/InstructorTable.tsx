
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, MessageCircle } from 'lucide-react';
import { Instructor } from '@/types/instructor';

interface InstructorTableProps {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
}

const InstructorTable: React.FC<InstructorTableProps> = ({ 
  instructors, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Specializations</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map(instructor => (
            <TableRow key={instructor.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
                    <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {instructor.name}
                </div>
              </TableCell>
              <TableCell>{instructor.email}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {instructor.phone}
                  {instructor.phone && (
                    <a 
                      href={`https://api.whatsapp.com/send?phone=${instructor.phone.replace(/\D/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-green-500 hover:text-green-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>{instructor.subject}</TableCell>
              <TableCell>{instructor.company}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {instructor.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-sm italic">{instructor.notes}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(instructor)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(instructor.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstructorTable;
