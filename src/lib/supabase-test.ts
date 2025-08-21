import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connected successfully!');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return { success: false, error: (error as Error).message };
  }
}

// You can call this function in your components to test the connection
// Example: testSupabaseConnection().then(result => console.log(result));
