// AI Service Implementation for AI Interior Canvas
// This service handles AI design generation using your existing architecture

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

type SupabaseClient = ReturnType<typeof createClient<Database>>;

export interface AIDesignRequest {
  projectId: string;
  roomPhotos: string[];
  roomMeasurements: {
    length: number;
    width: number;
    height: number;
    room_type: string;
  };
  stylePreferences: {
    calculated_style: string;
    style_scores: Record<string, number>;
  };
  designPrompt?: string;
}

export interface AIDesignResponse {
  designId: string;
  generatedImages: string[];
  designElements: DesignElement[];
  processingTime: number;
  aiModel: string;
}

export interface DesignElement {
  type: 'furniture' | 'lighting' | 'decoration' | 'flooring' | 'wall_treatment';
  name: string;
  description?: string;
  color?: string;
  material?: string;
  price_estimate?: number;
  product_url?: string;
}

export class AIService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generate design using OpenAI DALL-E 3
   */
  async generateDesignWithOpenAI(request: AIDesignRequest): Promise<AIDesignResponse> {
    const startTime = Date.now();
    
    try {
      // Build optimized prompt
      const prompt = this.buildDesignPrompt(request);
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1, // DALL-E 3 only supports n=1
          size: "1024x1024",
          quality: "hd",
          style: "natural" // or "vivid" for more dramatic results
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      // Process and analyze the generated image
      const designElements = await this.extractDesignElements(data.data[0].url, request);

      // Save to database
      const designRecord = await this.saveToDatabase(request.projectId, {
        design_prompt: prompt,
        ai_model_used: 'dall-e-3',
        generated_images: [data.data[0].url],
        design_elements: designElements,
        processing_status: 'completed',
        generation_time: processingTime
      });

      return {
        designId: designRecord.id,
        generatedImages: [data.data[0].url],
        designElements,
        processingTime,
        aiModel: 'dall-e-3'
      };

    } catch (error) {
      console.error('AI Design Generation Error:', error);
      
      // Update status to failed
      await this.supabase
        .from('ai_designs')
        .update({ processing_status: 'failed' })
        .eq('project_id', request.projectId);
        
      throw error;
    }
  }

  /**
   * Alternative: Generate design using Midjourney API
   */
  async generateDesignWithMidjourney(request: AIDesignRequest): Promise<AIDesignResponse> {
    // Implement Midjourney API integration
    // Note: Midjourney doesn't have official API yet, so this would use unofficial APIs
    
    const prompt = this.buildMidjourneyPrompt(request);
    
    // Example using unofficial Midjourney API
    const response = await fetch('https://api.midjourneyapi.xyz/mj/v2/imagine', {
      method: 'POST',
      headers: {
        'X-API-KEY': import.meta.env.VITE_MIDJOURNEY_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: '16:9'
      })
    });

    // Process response similar to OpenAI
    const data = await response.json();
    return this.processMidjourneyResponse(data, request);
  }

  /**
   * Build optimized prompt for interior design generation
   */
  private buildDesignPrompt(request: AIDesignRequest): string {
    const { roomMeasurements, stylePreferences } = request;
    
    const stylePrompt = this.getStylePrompt(stylePreferences.calculated_style);
    const roomContext = `${roomMeasurements.room_type} room (${roomMeasurements.length}m × ${roomMeasurements.width}m)`;
    
    return `
Professional interior design of a ${roomContext}.
${stylePrompt}
High-quality furniture and decor from Adariz collection.
Natural lighting, realistic materials, magazine-quality photography.
Show complete room layout with furniture placement.
Color palette: ${this.getColorPalette(stylePreferences.style_scores)}.
--ar 16:9 --style natural
    `.trim();
  }

  /**
   * Extract design elements from generated image using AI vision
   */
  private async extractDesignElements(imageUrl: string, request: AIDesignRequest): Promise<DesignElement[]> {
    try {
      // Use OpenAI Vision API to analyze the generated image
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this interior design image and extract furniture and decor elements. Return a JSON array of design elements with type, name, estimated color, material, and price estimate in EUR."
                },
                {
                  type: "image_url",
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);
      
      // Map to your DesignElement interface
      return analysis.map((element: any) => ({
        type: element.type,
        name: element.name,
        description: element.description,
        color: element.color,
        material: element.material,
        price_estimate: element.price_estimate
      }));

    } catch (error) {
      console.error('Element extraction failed:', error);
      
      // Fallback: Return basic elements based on room type
      return this.getDefaultElementsForRoom(request.roomMeasurements.room_type);
    }
  }

  /**
   * Save AI design to database
   */
  private async saveToDatabase(projectId: string, designData: any) {
    const { data, error } = await this.supabase
      .from('ai_designs')
      .insert({
        project_id: projectId,
        ...designData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get style-specific prompts
   */
  private getStylePrompt(style: string): string {
    const stylePrompts = {
      modern: "Clean lines, minimalist furniture, neutral colors, contemporary materials",
      traditional: "Classic furniture, warm wood tones, elegant fabrics, timeless design",
      minimalist: "Simple forms, white and neutral palette, functional furniture, clutter-free",
      contemporary: "Current trends, mixed materials, bold accents, sophisticated layout",
      industrial: "Raw materials, metal and wood, exposed elements, urban aesthetic",
      scandinavian: "Light woods, cozy textiles, natural light, hygge atmosphere",
      bohemian: "Eclectic mix, rich textures, warm colors, artistic elements",
      rustic: "Natural materials, weathered wood, earthy tones, countryside charm"
    };

    return stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.modern;
  }

  /**
   * Get color palette based on style scores
   */
  private getColorPalette(styleScores: Record<string, number>): string {
    const dominantStyle = Object.entries(styleScores)
      .sort(([,a], [,b]) => b - a)[0][0];

    const palettes = {
      modern: "white, gray, black, chrome accents",
      traditional: "warm beige, deep brown, burgundy, gold",
      minimalist: "pure white, light gray, natural wood",
      contemporary: "charcoal, cream, teal, copper",
      industrial: "dark gray, rust, black, raw metal",
      scandinavian: "white, light wood, soft blue, pale green",
      bohemian: "terracotta, deep blue, emerald, gold",
      rustic: "earth brown, forest green, cream, natural stone"
    };

    return palettes[dominantStyle as keyof typeof palettes] || palettes.modern;
  }

  /**
   * Fallback design elements for room types
   */
  private getDefaultElementsForRoom(roomType: string): DesignElement[] {
    const elements = {
      'living_room': [
        { type: 'furniture' as const, name: 'Sofa', price_estimate: 800 },
        { type: 'furniture' as const, name: 'Coffee Table', price_estimate: 300 },
        { type: 'lighting' as const, name: 'Floor Lamp', price_estimate: 150 },
        { type: 'decoration' as const, name: 'Wall Art', price_estimate: 100 }
      ],
      'bedroom': [
        { type: 'furniture' as const, name: 'Bed Frame', price_estimate: 600 },
        { type: 'furniture' as const, name: 'Nightstand', price_estimate: 200 },
        { type: 'lighting' as const, name: 'Table Lamp', price_estimate: 80 },
        { type: 'decoration' as const, name: 'Curtains', price_estimate: 120 }
      ],
      'kitchen': [
        { type: 'furniture' as const, name: 'Bar Stools', price_estimate: 400 },
        { type: 'lighting' as const, name: 'Pendant Lights', price_estimate: 200 },
        { type: 'decoration' as const, name: 'Kitchen Island Decor', price_estimate: 50 }
      ]
    };

    return elements[roomType as keyof typeof elements] || elements.living_room;
  }

  /**
   * Build Midjourney-specific prompt
   */
  private buildMidjourneyPrompt(request: AIDesignRequest): string {
    const { roomMeasurements, stylePreferences } = request;
    
    return `
interior design ${roomMeasurements.room_type} ${stylePreferences.calculated_style} style 
professional photography hyperrealistic 8k 
furniture decor lighting modern elegant 
--ar 16:9 --v 6 --style raw
    `.trim();
  }

  /**
   * Process Midjourney API response
   */
  private async processMidjourneyResponse(data: any, request: AIDesignRequest): Promise<AIDesignResponse> {
    // Implementation would depend on the specific Midjourney API response format
    // This is a placeholder for the structure
    
    return {
      designId: data.id,
      generatedImages: [data.image_url],
      designElements: await this.extractDesignElements(data.image_url, request),
      processingTime: data.processing_time,
      aiModel: 'midjourney'
    };
  }
}

// Usage example:
// const aiService = new AIService(supabase);
// const result = await aiService.generateDesignWithOpenAI({
//   projectId: 'uuid',
//   roomPhotos: ['url1', 'url2'],
//   roomMeasurements: { length: 4, width: 3, height: 2.5, room_type: 'living_room' },
//   stylePreferences: { calculated_style: 'modern', style_scores: { modern: 0.8 } }
// });
