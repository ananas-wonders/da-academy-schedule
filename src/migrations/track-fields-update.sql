
-- Add new fields to tracks table
ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS supervisor TEXT,
ADD COLUMN IF NOT EXISTS deputy_supervisor TEXT,
ADD COLUMN IF NOT EXISTS students_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS student_coordinator TEXT,
ADD COLUMN IF NOT EXISTS teams_link TEXT,
ADD COLUMN IF NOT EXISTS assignment_folder TEXT,
ADD COLUMN IF NOT EXISTS grade_sheet TEXT,
ADD COLUMN IF NOT EXISTS attendance_form TEXT,
ADD COLUMN IF NOT EXISTS telegram_general_group TEXT,
ADD COLUMN IF NOT EXISTS telegram_course_group TEXT;

-- Make sure we have at least one visible track for testing
INSERT INTO tracks (id, name, code, supervisor, students_count, visible)
SELECT 'track-test-program', 'Test Program', 'TEST101', 'John Doe', 25, true
WHERE NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'TEST101');
