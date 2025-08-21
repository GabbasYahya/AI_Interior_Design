/**
 * Product Catalog Service for Adariz Platform
 * 
 * Handles product synchronization, smart recommendations, and catalog management
 * Integrates with external APIs and manages local product database
 * 
 * @author Adariz Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

type SupabaseClient = ReturnType<typeof createClient<Database>>;

export interface AdarizProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  images: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  materials: string[];
  colors: string[];
  style_tags: string[];
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  url: string;
  model_3d_url?: string;
  metadata: Record<string, any>;
}

export interface ProductRecommendationEngine {
  getRecommendationsForStyle(style: string, budget?: number): Promise<Product[]>;
  getRecommendationsForDesign(designElements: any[]): Promise<Product[]>;
  getRecommendationsForRoom(roomType: string, measurements: any): Promise<Product[]>;
  searchProducts(query: string, filters?: ProductFilters): Promise<Product[]>;
}

export interface ProductFilters {
  category?: string;
  priceRange?: { min: number; max: number };
  colors?: string[];
  materials?: string[];
  styles?: string[];
  inStock?: boolean;
}

export interface Product {
  id: string;
  adariz_product_id: string;
  name: string;
  description: string;
  category_id: string;
  price: number;
  currency: string;
  images: string[];
  dimensions: Record<string, any>;
  materials: string[];
  colors: string[];
  style_tags: string[];
  availability_status: string;
  adariz_url: string;
  model_3d_url?: string;
  metadata: Record<string, any>;
}

export class ProductCatalogService implements ProductRecommendationEngine {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Sync products from Adariz API to local database
   */
  async syncAdarizProducts(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    try {
      console.log('Starting Adariz product sync...');
      
      // Fetch products from Adariz API
      const adarizProducts = await this.fetchAdarizCatalog();
      
      for (const product of adarizProducts) {
        try {
          await this.upsertProduct(product);
          success++;
        } catch (error) {
          console.error(`Failed to sync product ${product.id}:`, error);
          failed++;
        }
      }

      console.log(`Sync complete: ${success} successful, ${failed} failed`);
      return { success, failed };

    } catch (error) {
      console.error('Product sync failed:', error);
      throw error;
    }
  }

  /**
   * Get product recommendations based on user's style preferences
   */
  async getRecommendationsForStyle(
    style: string, 
    budget?: number
  ): Promise<Product[]> {
    try {
      let query = this.supabase
        .from('products')
        .select('*')
        .contains('style_tags', [style])
        .eq('availability_status', 'available')
        .order('price', { ascending: true });

      if (budget) {
        query = query.lte('price', budget);
      }

      const { data, error } = await query.limit(20);
      
      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Style recommendations failed:', error);
      return [];
    }
  }

  /**
   * Get product recommendations based on AI-generated design elements
   */
  async getRecommendationsForDesign(designElements: any[]): Promise<Product[]> {
    const recommendations: Product[] = [];

    try {
      for (const element of designElements) {
        // Match products by type and style
        const { data } = await this.supabase
          .from('products')
          .select('*')
          .ilike('name', `%${element.name}%`)
          .contains('style_tags', element.style ? [element.style] : [])
          .eq('availability_status', 'available')
          .limit(3);

        if (data) {
          recommendations.push(...data);
        }
      }

      // Remove duplicates and sort by relevance
      const uniqueProducts = this.removeDuplicates(recommendations);
      return this.sortByRelevance(uniqueProducts, designElements);

    } catch (error) {
      console.error('Design recommendations failed:', error);
      return [];
    }
  }

  /**
   * Get product recommendations for specific room type and size
   */
  async getRecommendationsForRoom(
    roomType: string, 
    measurements: { length: number; width: number; height: number }
  ): Promise<Product[]> {
    const roomArea = measurements.length * measurements.width;
    
    try {
      // Get products suitable for room size
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .contains('metadata', { suitable_rooms: [roomType] })
        .eq('availability_status', 'available')
        .order('price', { ascending: true });

      if (error) throw error;
      
      // Filter by room size compatibility
      return (data || []).filter(product => 
        this.isProductSuitableForRoom(product, roomArea)
      );

    } catch (error) {
      console.error('Room recommendations failed:', error);
      return [];
    }
  }

  /**
   * Search products with filters
   */
  async searchProducts(query: string, filters?: ProductFilters): Promise<Product[]> {
    try {
      let dbQuery = this.supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      // Apply filters
      if (filters) {
        if (filters.category) {
          dbQuery = dbQuery.eq('category_id', filters.category);
        }
        
        if (filters.priceRange) {
          dbQuery = dbQuery
            .gte('price', filters.priceRange.min)
            .lte('price', filters.priceRange.max);
        }
        
        if (filters.colors?.length) {
          dbQuery = dbQuery.overlaps('colors', filters.colors);
        }
        
        if (filters.materials?.length) {
          dbQuery = dbQuery.overlaps('materials', filters.materials);
        }
        
        if (filters.styles?.length) {
          dbQuery = dbQuery.overlaps('style_tags', filters.styles);
        }
        
        if (filters.inStock) {
          dbQuery = dbQuery.eq('availability_status', 'available');
        }
      }

      const { data, error } = await dbQuery.limit(50);
      
      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Product search failed:', error);
      return [];
    }
  }

  /**
   * Get product details with related recommendations
   */
  async getProductDetails(productId: string): Promise<{
    product: Product;
    relatedProducts: Product[];
    alternativeColors: Product[];
  } | null> {
    try {
      // Get main product
      const { data: product, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error || !product) return null;

      // Get related products (same category, similar style)
      const { data: related } = await this.supabase
        .from('products')
        .select('*')
        .eq('category_id', product.category_id)
        .overlaps('style_tags', product.style_tags)
        .neq('id', productId)
        .limit(6);

      // Get alternative colors (same product line)
      const { data: alternatives } = await this.supabase
        .from('products')
        .select('*')
        .ilike('name', `%${product.name.split(' ')[0]}%`)
        .neq('id', productId)
        .limit(4);

      return {
        product,
        relatedProducts: related || [],
        alternativeColors: alternatives || []
      };

    } catch (error) {
      console.error('Get product details failed:', error);
      return null;
    }
  }

  /**
   * Fetch products from Adariz API
   */
  private async fetchAdarizCatalog(): Promise<AdarizProduct[]> {
    try {
      const response = await fetch('https://api.adariz.com/v1/products', {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_ADARIZ_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Adariz API error: ${response.status}`);
      }

      const data = await response.json();
      return data.products || [];

    } catch (error) {
      console.error('Failed to fetch Adariz catalog:', error);
      
      // Return mock data for development
      return this.getMockAdarizProducts();
    }
  }

  /**
   * Upsert product to database
   */
  private async upsertProduct(adarizProduct: AdarizProduct): Promise<void> {
    const productData = {
      adariz_product_id: adarizProduct.id,
      name: adarizProduct.name,
      description: adarizProduct.description,
      price: adarizProduct.price,
      currency: adarizProduct.currency,
      images: adarizProduct.images,
      dimensions: adarizProduct.dimensions,
      materials: adarizProduct.materials,
      colors: adarizProduct.colors,
      style_tags: adarizProduct.style_tags,
      availability_status: this.mapAvailabilityStatus(adarizProduct.availability),
      adariz_url: adarizProduct.url,
      model_3d_url: adarizProduct.model_3d_url,
      metadata: adarizProduct.metadata
    };

    const { error } = await this.supabase
      .from('products')
      .upsert(productData, { 
        onConflict: 'adariz_product_id' 
      });

    if (error) throw error;
  }

  /**
   * Remove duplicate products
   */
  private removeDuplicates(products: Product[]): Product[] {
    const seen = new Set();
    return products.filter(product => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    });
  }

  /**
   * Sort products by relevance to design elements
   */
  private sortByRelevance(products: Product[], designElements: any[]): Product[] {
    return products.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, designElements);
      const scoreB = this.calculateRelevanceScore(b, designElements);
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate relevance score for a product
   */
  private calculateRelevanceScore(product: Product, designElements: any[]): number {
    let score = 0;
    
    for (const element of designElements) {
      // Name match
      if (product.name.toLowerCase().includes(element.name?.toLowerCase())) {
        score += 10;
      }
      
      // Style match
      if (element.style && product.style_tags.includes(element.style)) {
        score += 5;
      }
      
      // Color match
      if (element.color && product.colors.includes(element.color)) {
        score += 3;
      }
      
      // Material match
      if (element.material && product.materials.includes(element.material)) {
        score += 3;
      }
    }
    
    return score;
  }

  /**
   * Check if product is suitable for room size
   */
  private isProductSuitableForRoom(product: Product, roomArea: number): boolean {
    const productDimensions = product.dimensions;
    
    if (!productDimensions?.width || !productDimensions?.depth) {
      return true; // No size restrictions
    }
    
    const productArea = productDimensions.width * productDimensions.depth;
    const suitabilityRatio = productArea / roomArea;
    
    // Product should not take more than 20% of room area for furniture
    return suitabilityRatio <= 0.2;
  }

  /**
   * Map Adariz availability to internal status
   */
  private mapAvailabilityStatus(availability: string): string {
    const mapping = {
      'in_stock': 'available',
      'low_stock': 'limited',
      'out_of_stock': 'unavailable'
    };
    
    return mapping[availability as keyof typeof mapping] || 'unknown';
  }

  /**
   * Mock Adariz products for development
   */
  private getMockAdarizProducts(): AdarizProduct[] {
    return [
      {
        id: 'adariz_001',
        name: 'Modern Sectional Sofa',
        description: 'Contemporary L-shaped sofa with clean lines',
        category: 'furniture',
        subcategory: 'seating',
        price: 1299.99,
        currency: 'EUR',
        images: ['/api/placeholder/400/300'],
        dimensions: { width: 250, height: 85, depth: 180, unit: 'cm' },
        materials: ['fabric', 'wood', 'metal'],
        colors: ['gray', 'navy', 'beige'],
        style_tags: ['modern', 'contemporary', 'minimalist'],
        availability: 'in_stock',
        url: 'https://adariz.com/products/modern-sectional-sofa',
        metadata: { suitable_rooms: ['living_room'], weight: 45 }
      },
      {
        id: 'adariz_002',
        name: 'Scandinavian Coffee Table',
        description: 'Oak wood coffee table with clean design',
        category: 'furniture',
        subcategory: 'tables',
        price: 399.99,
        currency: 'EUR',
        images: ['/api/placeholder/400/300'],
        dimensions: { width: 120, height: 45, depth: 60, unit: 'cm' },
        materials: ['oak', 'wood'],
        colors: ['natural', 'light_oak'],
        style_tags: ['scandinavian', 'minimalist', 'modern'],
        availability: 'in_stock',
        url: 'https://adariz.com/products/scandinavian-coffee-table',
        metadata: { suitable_rooms: ['living_room'], weight: 15 }
      }
    ];
  }
}

// Usage examples:
// const catalogService = new ProductCatalogService(supabase);
// 
// // Sync products
// await catalogService.syncAdarizProducts();
// 
// // Get recommendations
// const styleRecs = await catalogService.getRecommendationsForStyle('modern', 1000);
// const roomRecs = await catalogService.getRecommendationsForRoom('living_room', {length: 4, width: 3, height: 2.5});
// 
// // Search products
// const searchResults = await catalogService.searchProducts('sofa', {
//   priceRange: { min: 500, max: 2000 },
//   styles: ['modern', 'contemporary']
// });
