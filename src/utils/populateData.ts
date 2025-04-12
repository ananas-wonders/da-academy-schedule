
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, getDay } from "date-fns";

export async function populateDummySessions() {
  try {
    // First, check if we already have sessions in the database
    const { count, error: countError } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // If we already have sessions, don't add more
    if (count && count > 0) {
      console.log(`Database already has ${count} sessions, skipping data population`);
      return;
    }
    
    // Generate sessions for 30 days
    const today = new Date();
    const dummySessions = [];
    
    // Course titles
    const courses = [
      "Digital Painting Fundamentals",
      "3D Modeling Workshop",
      "Typography & Layout Design",
      "User Interface Design",
      "Animation Principles",
      "Character Design",
      "Color Theory Advanced",
      "Vector Graphics Masterclass",
      "Motion Graphics Essentials",
      "Digital Photography Processing"
    ];
    
    // Instructors
    const instructors = [
      "Alex Johnson",
      "Maria Garcia",
      "David Kim",
      "Sarah Williams",
      "James Chen",
      "Aisha Patel",
      "Robert Taylor",
      "Emma Rodriguez",
      "Michael Wilson",
      "Olivia Martinez"
    ];
    
    // Session types
    const types = ["online", "offline"];
    
    // Time slots
    const timeSlots = ["9am-12pm", "1pm-3:45pm", "4pm-6:45pm"];
    
    // Tracks
    const tracks = [
      "track-1", // Intro to Digital Art
      "track-2", // Graphic Design Basics
      "track-3", // 3D Modeling Advanced
      "track-4", // Animation Techniques
      "track-5", // Portfolio Development
      "track-6"  // UI/UX Masterclass
    ];
    
    // Generate sessions for each day and track
    for (let i = 0; i < 30; i++) {
      const currentDate = addDays(today, i);
      const dayId = format(currentDate, 'yyyy-MM-dd');
      const weekday = getDay(currentDate);
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (weekday === 0 || weekday === 6) continue;
      
      // Generate 1-3 sessions per track per day
      tracks.forEach(trackId => {
        const sessionsCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < sessionsCount; j++) {
          // Create a unique instructor assignment
          const instructorIndex = Math.floor(Math.random() * instructors.length);
          const instructor = instructors[instructorIndex];
          
          // Deliberately create some instructor conflicts for demonstration
          // 20% chance of creating a conflict
          const createConflict = Math.random() < 0.2 && i < 15;
          
          // Pick a course and time
          const courseIndex = Math.floor(Math.random() * courses.length);
          const course = courses[courseIndex];
          
          const typeIndex = Math.floor(Math.random() * types.length);
          const type = types[typeIndex];
          
          const timeIndex = Math.floor(Math.random() * timeSlots.length);
          const time = timeSlots[timeIndex];
          
          // Create session ID
          const sessionId = `session-${dayId}-${trackId}-${j}`;
          
          // Use the same instructor and time but different track if creating a conflict
          if (createConflict && j === 0) {
            // Create two sessions with the same instructor at the same time on different tracks
            const conflictTrackIndex = Math.floor(Math.random() * tracks.length);
            const conflictTrack = tracks[conflictTrackIndex];
            
            if (conflictTrack !== trackId) {
              const conflictSessionId = `session-${dayId}-${conflictTrack}-conflict`;
              
              dummySessions.push({
                id: conflictSessionId,
                day_id: dayId,
                track_id: conflictTrack,
                title: `${course} (Conflict Demo)`,
                instructor,
                type,
                time,
                count: Math.floor(Math.random() * 10),
                total: 10
              });
            }
          }
          
          // Add the regular session
          dummySessions.push({
            id: sessionId,
            day_id: dayId,
            track_id: trackId,
            title: course,
            instructor,
            type,
            time,
            count: Math.floor(Math.random() * 10),
            total: 10
          });
        }
      });
    }
    
    // Insert data in batches to avoid hitting request size limits
    const batchSize = 100;
    for (let i = 0; i < dummySessions.length; i += batchSize) {
      const batch = dummySessions.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('sessions')
        .insert(batch);
      
      if (error) throw error;
      console.log(`Inserted batch ${i/batchSize + 1} of ${Math.ceil(dummySessions.length/batchSize)}`);
    }
    
    console.log(`Successfully inserted ${dummySessions.length} dummy sessions`);
    return dummySessions.length;
  } catch (error) {
    console.error('Error populating dummy data:', error);
    throw error;
  }
}
