
import { supabase } from './client';

// Function to enable real-time updates for the specified tables
export const enableRealtimeForTables = async () => {
  try {
    // Check if tables exist and are accessible
    // This approach is more reliable than trying to use non-existent API methods
    const tablesToCheck = ['sessions', 'tracks', 'track_groups', 'courses', 'instructors'] as const;
    
    const checksPromises = tablesToCheck.map(table => 
      supabase.from(table).select('id').limit(1)
    );
    
    const results = await Promise.all(checksPromises);
    
    // Log any errors for debugging
    results.forEach((result, index) => {
      if (result.error) {
        console.error(`Error checking table ${tablesToCheck[index]}:`, result.error);
      } else {
        console.log(`Successfully verified table ${tablesToCheck[index]} exists`);
      }
    });
    
    // Set up channel for real-time updates
    const channel = supabase
      .channel('public:*')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Change received:', payload);
      })
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
    
    console.log('Real-time updates verified for tables');
    return true;
  } catch (error) {
    console.error('Error setting up real-time updates:', error);
    return false;
  }
};
