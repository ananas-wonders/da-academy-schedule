
export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  company: string;
  notes: string;
  specialization: string[];
  imageUrl?: string;
  bio?: string;
}

// Add fields that match the database structure
export interface InstructorDB {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  company?: string;
  notes?: string;
  specialization?: string[];
  imageUrl?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}
