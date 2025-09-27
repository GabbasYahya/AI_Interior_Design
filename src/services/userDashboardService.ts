// User Dashboard Service - Real Data Management
// Handles user projects, favorites, and dashboard statistics

import { supabase } from '@/integrations/supabase/client';

export interface UserProject {
  id: string;
  name: string;
  room_type: string;
  style_preference: string | null;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  user_id: string;
  room_measurements?: { id: string }[];
  thumbnail_url?: string | null;
  description?: string | null;
  budget_range?: string | null;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  favoritable_type: 'project' | 'ai_design' | 'photo';
  favoritable_id: string;
  created_at: string;
  // These will be populated by joining with the actual items
  item_name?: string;
  item_image?: string;
  item_description?: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalFavorites: number;
  totalGenerations: number;
  totalMeasurements: number;
}

class UserDashboardService {
  
  /**
   * Fetch user projects with room measurements
   */
  async getUserProjects(userId: string): Promise<UserProject[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          room_measurements(id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user projects:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user projects:', error);
      return [];
    }
  }

  /**
   * Fetch user favorites (projects, AI designs, photos)
   */
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user favorites:', error);
        return [];
      }

      // For now, return basic favorites data
      // In the future, we can join with the actual items based on favoritable_type
      return (data || []).map(favorite => ({
        id: favorite.id,
        user_id: favorite.user_id,
        favoritable_type: favorite.favoritable_type,
        favoritable_id: favorite.favoritable_id,
        created_at: favorite.created_at,
        item_name: `${favorite.favoritable_type} favori`,
        item_image: undefined,
        item_description: `Favori de type ${favorite.favoritable_type}`
      }));
    } catch (error) {
      console.error('Failed to fetch user favorites:', error);
      return [];
    }
  }

  /**
   * Get AI generations count for user
   * Currently uses generated_rooms table until ai_generations is created
   */
  async getAIGenerationsCount(userId: string): Promise<number> {
    try {
      // Use generated_rooms table for now
      const { count, error } = await supabase
        .from('generated_rooms')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.log('No generated rooms found or error:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.log('AI generations count not available, returning 0');
      return 0;
    }
  }

  /**
   * Calculate dashboard statistics
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const [projects, favorites, generationsCount] = await Promise.all([
        this.getUserProjects(userId),
        this.getUserFavorites(userId),
        this.getAIGenerationsCount(userId)
      ]);

      // Calculate total measurements across all projects
      const totalMeasurements = projects.reduce((total, project) => {
        return total + (project.room_measurements?.length || 0);
      }, 0);

      return {
        totalProjects: projects.length,
        totalFavorites: favorites.length,
        totalGenerations: generationsCount,
        totalMeasurements: totalMeasurements
      };
    } catch (error) {
      console.error('Failed to calculate dashboard stats:', error);
      return {
        totalProjects: 0,
        totalFavorites: 0,
        totalGenerations: 0,
        totalMeasurements: 0
      };
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData: {
    user_id: string;
    name: string;
    room_type: string;
    style_preference?: string;
    status?: 'draft' | 'in_progress' | 'completed' | 'archived';
    description?: string;
    budget_range?: string;
  }): Promise<UserProject | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return null;
      }

      return data as UserProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      return null;
    }
  }

  /**
   * Update project status
   */
  async updateProjectStatus(projectId: string, status: UserProject['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) {
        console.error('Error updating project status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to update project status:', error);
      return false;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      return false;
    }
  }

  /**
   * Add item to favorites (projects, AI designs, or photos)
   */
  async addToFavorites(
    userId: string, 
    itemId: string, 
    itemType: 'project' | 'ai_design' | 'photo' = 'project'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{
          user_id: userId,
          favoritable_type: itemType,
          favoritable_id: itemId
        }]);

      if (error) {
        console.error('Error adding to favorites:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      return false;
    }
  }

  /**
   * Remove item from favorites
   */
  async removeFromFavorites(
    userId: string, 
    itemId: string, 
    itemType: 'project' | 'ai_design' | 'photo' = 'project'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('favoritable_type', itemType)
        .eq('favoritable_id', itemId);

      if (error) {
        console.error('Error removing from favorites:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      return false;
    }
  }
}

export const userDashboardService = new UserDashboardService();