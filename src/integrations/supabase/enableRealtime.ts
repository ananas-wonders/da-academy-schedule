
import { supabase } from './client';

// Function to enable real-time updates for the specified tables
export const enableRealtimeForTables = async () => {
  try {
    // Enable real-time for sessions table
    await supabase
      .schema('public')
      .unaltered("sessions")
      .enable_realtime("sessions");
      
    // Enable real-time for tracks table
    await supabase
      .schema('public')
      .unaltered("tracks")
      .enable_realtime("tracks");
      
    // Enable real-time for track_groups table
    await supabase
      .schema('public')
      .unaltered("track_groups")
      .enable_realtime("track_groups");
      
    console.log('Real-time updates enabled for tables');
    return true;
  } catch (error) {
    console.error('Error enabling real-time updates:', error);
    return false;
  }
};
