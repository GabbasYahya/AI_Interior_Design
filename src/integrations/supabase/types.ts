export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      adariz_products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: string | null
          image_url: string
          category: string
          style: string[]
          instagram_post_id: string | null
          instagram_post_url: string | null
          tags: string[]
          in_stock: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price?: string | null
          image_url: string
          category: string
          style?: string[]
          instagram_post_id?: string | null
          instagram_post_url?: string | null
          tags?: string[]
          in_stock?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: string | null
          image_url?: string
          category?: string
          style?: string[]
          instagram_post_id?: string | null
          instagram_post_url?: string | null
          tags?: string[]
          in_stock?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_rooms: {
        Row: {
          id: string
          user_id: string | null
          image_url: string
          description: string | null
          design_elements: string[]
          ai_prompt: string | null
          room_type: string
          dimensions: Json | null
          style_profile: Json | null
          recommended_products: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          image_url: string
          description?: string | null
          design_elements?: string[]
          ai_prompt?: string | null
          room_type: string
          dimensions?: Json | null
          style_profile?: Json | null
          recommended_products?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          image_url?: string
          description?: string | null
          design_elements?: string[]
          ai_prompt?: string | null
          room_type?: string
          dimensions?: Json | null
          style_profile?: Json | null
          recommended_products?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_rooms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      instagram_sync: {
        Row: {
          id: string
          last_sync_at: string | null
          total_posts_processed: number
          total_products_extracted: number
          status: string
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          last_sync_at?: string | null
          total_posts_processed?: number
          total_products_extracted?: number
          status?: string
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          last_sync_at?: string | null
          total_posts_processed?: number
          total_products_extracted?: number
          status?: string
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          plan_type: 'free' | 'premium' | 'pro'
          credits: number
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          plan_type?: 'free' | 'premium' | 'pro'
          credits?: number
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          plan_type?: 'free' | 'premium' | 'pro'
          credits?: number
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          room_type: string
          style_preference: string | null
          budget_range: string | null
          status: 'draft' | 'in_progress' | 'completed' | 'archived'
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          room_type: string
          style_preference?: string | null
          budget_range?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          room_type?: string
          style_preference?: string | null
          budget_range?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      room_measurements: {
        Row: {
          id: string
          project_id: string
          length: number
          width: number
          height: number
          doors: Json
          windows: Json
          obstacles: Json
          measurements_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          length: number
          width: number
          height: number
          doors?: Json
          windows?: Json
          obstacles?: Json
          measurements_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          length?: number
          width?: number
          height?: number
          doors?: Json
          windows?: Json
          obstacles?: Json
          measurements_data?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_measurements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      room_photos: {
        Row: {
          id: string
          project_id: string
          file_path: string
          file_name: string
          file_size: number | null
          file_type: string | null
          photo_type: 'original' | 'ai_generated' | 'edited'
          description: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_path: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          photo_type?: 'original' | 'ai_generated' | 'edited'
          description?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_path?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          photo_type?: 'original' | 'ai_generated' | 'edited'
          description?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      style_quiz_results: {
        Row: {
          id: string
          user_id: string
          quiz_responses: Json
          calculated_style: string
          style_scores: Json
          recommendations: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_responses: Json
          calculated_style: string
          style_scores: Json
          recommendations?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_responses?: Json
          calculated_style?: string
          style_scores?: Json
          recommendations?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "style_quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_designs: {
        Row: {
          id: string
          project_id: string
          design_prompt: string
          ai_model_used: string
          generated_images: Json
          design_elements: Json
          processing_status: 'pending' | 'processing' | 'completed' | 'failed'
          generation_time: number | null
          user_rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          design_prompt: string
          ai_model_used?: string
          generated_images?: Json
          design_elements?: Json
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          generation_time?: number | null
          user_rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          design_prompt?: string
          ai_model_used?: string
          generated_images?: Json
          design_elements?: Json
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          generation_time?: number | null
          user_rating?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_designs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          favoritable_type: 'project' | 'ai_design' | 'photo'
          favoritable_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          favoritable_type: 'project' | 'ai_design' | 'photo'
          favoritable_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          favoritable_type?: 'project' | 'ai_design' | 'photo'
          favoritable_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      product_recommendations: {
        Row: {
          id: string
          project_id: string
          ai_design_id: string | null
          product_name: string
          product_category: string
          product_description: string | null
          estimated_price: number | null
          product_url: string | null
          image_url: string | null
          ai_reasoning: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          ai_design_id?: string | null
          product_name: string
          product_category: string
          product_description?: string | null
          estimated_price?: number | null
          product_url?: string | null
          image_url?: string | null
          ai_reasoning?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          ai_design_id?: string | null
          product_name?: string
          product_category?: string
          product_description?: string | null
          estimated_price?: number | null
          product_url?: string | null
          image_url?: string | null
          ai_reasoning?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recommendations_ai_design_id_fkey"
            columns: ["ai_design_id"]
            isOneToOne: false
            referencedRelation: "ai_designs"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
