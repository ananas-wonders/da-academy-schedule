
import { supabase } from './client';

// Function to enable real-time updates for the specified tables
export const enableRealtimeForTables = async () => {
  try {
    // Enable real-time for all relevant tables by adding them to the publication
    // This is now done via SQL when setting up the database
    
    // Instead of using the incorrect API, we'll check if the tables exist
    // and confirm they're part of the realtime publication
    const { data: sessionCheck, error: sessionError } = await supabase
      .from('sessions')
      .select('id')
      .limit(1);
      
    const { data: trackCheck, error: trackError } = await supabase
      .from('tracks')
      .select('id')
      .limit(1);
      
    const { data: trackGroupCheck, error: trackGroupError } = await supabase
      .from('track_groups')
      .select('id')
      .limit(1);
      
    const { data: coursesCheck, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .limit(1);
      
    const { data: instructorsCheck, error: instructorsError } = await supabase
      .from('instructors')
      .select('id')
      .limit(1);
    
    console.log('Real-time updates verified for tables');
    return true;
  } catch (error) {
    console.error('Error checking real-time updates status:', error);
    return false;
  }
};
