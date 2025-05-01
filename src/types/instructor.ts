
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
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  company?: string | null;
  notes?: string | null;
  specialization?: string[] | null;
  imageUrl?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
}
