/**
 * Furniture API Service - External Product Integration
 * 
 * Manages integration with external furniture APIs for real-time product data
 * Handles rate limiting, caching, and product recommendations
 * 
 * @author Adariz Team
 * @version 1.0.0
 */

import { supabase } from '../integrations/supabase/client';

export interface FurnitureProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  wood_type: string;
  finish: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  price: number;
  discount_price?: number;
  weight: number;
  image_path: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  featured: boolean;
  created_at: string;
  updated_at: string;
  tags?: string[] | null;
}

export interface FurnitureAPIResponse {
  success: boolean;
  count?: number;
  data: FurnitureProduct[] | FurnitureProduct;
  error?: string;
}

export interface ProductFilters {
  category?: string;
  wood_type?: string;
  finish?: string;
  min_price?: number;
  max_price?: number;
  min_stock?: number;
  max_stock?: number;
  featured?: boolean;
  name?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export class FurnitureAPIService {
  private baseURL = 'https://furniture-api.fly.dev';
  private requestCount = 0;
  private dailyLimit = 500;

  /**
   * Get product recommendations based on user style preferences
   */
  async getRecommendationsForStyle(
    style: string, 
    roomType?: string,
    budget?: number
  ): Promise<FurnitureProduct[]> {
    try {
      if (!this.canMakeRequest()) {
        console.warn('Rate limit approaching, using cached data');
        return this.getCachedRecommendations(style);
      }

      const filters = this.buildStyleFilters(style, roomType, budget);
      const products = await this.fetchProducts(filters);
      
      // Cache results for rate limit management
      await this.cacheRecommendations(style, products);
      
      return products;
    } catch (error) {
      console.error('Failed to get style recommendations:', error);
      return this.getCachedRecommendations(style);
    }
  }

  /**
   * Get products for specific room type and size
   */
  async getProductsForRoom(
    roomType: string,
    measurements: { length: number; width: number; height: number },
    style?: string,
    budget?: number
  ): Promise<FurnitureProduct[]> {
    try {
      const roomArea = measurements.length * measurements.width;
      const categories = this.getRoomCategories(roomType);
      const allProducts: FurnitureProduct[] = [];

      // Get products for each relevant category
      for (const category of categories.slice(0, 3)) { // Limit to 3 categories for rate limits
        const filters: ProductFilters = {
          category,
          limit: 5,
          ...(budget && { max_price: budget }),
          ...(style && this.getStyleFilters(style))
        };

        const products = await this.fetchProducts(filters);
        
        // Filter by room size compatibility
        const suitableProducts = products.filter(product => 
          this.isProductSuitableForRoom(product, roomArea)
        );
        
        allProducts.push(...suitableProducts);
      }

      return this.removeDuplicates(allProducts);
    } catch (error) {
      console.error('Failed to get room products:', error);
      return [];
    }
  }

  /**
   * Search products with text query and filters
   */
  async searchProducts(
    query: string, 
    filters?: ProductFilters
  ): Promise<FurnitureProduct[]> {
    try {
      const searchFilters: ProductFilters = {
        name: query,
        limit: 20,
        sort: 'newest',
        ...filters
      };

      return await this.fetchProducts(searchFilters);
    } catch (error) {
      console.error('Product search failed:', error);
      return [];
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10): Promise<FurnitureProduct[]> {
    try {
      return await this.fetchProducts({
        featured: true,
        limit,
        sort: 'newest'
      });
    } catch (error) {
      console.error('Failed to get featured products:', error);
      return [];
    }
  }

  /**
   * Get product details by SKU
   */
  async getProductDetails(sku: string): Promise<FurnitureProduct | null> {
    try {
      this.incrementRequestCount();
      
      const response = await fetch(`${this.baseURL}/v1/products/${sku}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: FurnitureAPIResponse = await response.json();
      
      if (data.success && !Array.isArray(data.data)) {
        return data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get product details:', error);
      return null;
    }
  }

  /**
   * Get products similar to a given product
   */
  async getSimilarProducts(product: FurnitureProduct): Promise<FurnitureProduct[]> {
    try {
      const filters: ProductFilters = {
        category: product.category,
        wood_type: product.wood_type,
        finish: product.finish,
        limit: 6
      };

      const products = await this.fetchProducts(filters);
      
      // Remove the original product from results
      return products.filter(p => p.sku !== product.sku);
    } catch (error) {
      console.error('Failed to get similar products:', error);
      return [];
    }
  }

  /**
   * Core API fetch method with error handling and rate limiting
   */
  private async fetchProducts(filters: ProductFilters & { 
    limit?: number; 
    offset?: number; 
    sort?: string;
  }): Promise<FurnitureProduct[]> {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded');
    }

    this.incrementRequestCount();

    const params = new URLSearchParams();
    
    // Build query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseURL}/v1/products?${params}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: FurnitureAPIResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return Array.isArray(data.data) ? data.data : [data.data];
  }

  /**
   * Build filters based on user style preferences
   */
  private buildStyleFilters(style: string, roomType?: string, budget?: number): ProductFilters {
    const baseFilters: ProductFilters = {
      limit: 15,
      sort: 'newest',
      ...(budget && { max_price: budget })
    };

    // Style to furniture characteristics mapping
    const styleMapping: Record<string, Partial<ProductFilters>> = {
      'modern': { finish: 'light', wood_type: 'maple' },
      'contemporary': { finish: 'medium' },
      'traditional': { wood_type: 'oak', finish: 'dark' },
      'scandinavian': { wood_type: 'pine', finish: 'natural' },
      'industrial': { finish: 'dark' },
      'minimalist': { finish: 'light' },
      'rustic': { wood_type: 'oak', finish: 'natural' },
      'bohemian': { wood_type: 'teak', finish: 'medium' }
    };

    // Room type to category mapping
    if (roomType) {
      const roomCategories = this.getRoomCategories(roomType);
      if (roomCategories.length > 0) {
        baseFilters.category = roomCategories[0]; // Use primary category
      }
    }

    return {
      ...baseFilters,
      ...styleMapping[style.toLowerCase()]
    };
  }

  /**
   * Get relevant categories for room type
   */
  private getRoomCategories(roomType: string): string[] {
    const categoryMapping: Record<string, string[]> = {
      'living_room': ['sofa', 'chair', 'table', 'tv table', 'lamp'],
      'bedroom': ['chair', 'wardrove', 'mirror', 'lamp'],
      'kitchen': ['kitchen', 'stool', 'table'],
      'dining_room': ['table', 'chair'],
      'office': ['desk', 'chair', 'lamp'],
      'bathroom': ['vanitory', 'mirror'],
      'hallway': ['mirror', 'chair'],
      'garden': ['garden']
    };

    return categoryMapping[roomType.toLowerCase()] || ['chair', 'table'];
  }

  /**
   * Get style-specific filters
   */
  private getStyleFilters(style: string): Partial<ProductFilters> {
    const styleFilters: Record<string, Partial<ProductFilters>> = {
      'modern': { finish: 'light' },
      'traditional': { wood_type: 'oak' },
      'scandinavian': { wood_type: 'pine', finish: 'natural' },
      'industrial': { finish: 'dark' },
      'minimalist': { finish: 'light' }
    };

    return styleFilters[style.toLowerCase()] || {};
  }

  /**
   * Check if product dimensions are suitable for room size
   */
  private isProductSuitableForRoom(product: FurnitureProduct, roomArea: number): boolean {
    const { dimensions } = product;
    
    if (!dimensions.width || !dimensions.depth) {
      return true; // No size restrictions
    }
    
    const productArea = (dimensions.width / 100) * (dimensions.depth / 100); // Convert cm to m
    const suitabilityRatio = productArea / roomArea;
    
    // Different ratios for different categories
    const maxRatios: Record<string, number> = {
      'sofa': 0.15,
      'table': 0.10,
      'desk': 0.12,
      'wardrove': 0.08,
      'chair': 0.05,
      'default': 0.10
    };
    
    const maxRatio = maxRatios[product.category] || maxRatios.default;
    return suitabilityRatio <= maxRatio;
  }

  /**
   * Remove duplicate products from array
   */
  private removeDuplicates(products: FurnitureProduct[]): FurnitureProduct[] {
    const seen = new Set();
    return products.filter(product => {
      if (seen.has(product.sku)) return false;
      seen.add(product.sku);
      return true;
    });
  }

  /**
   * Rate limiting management
   */
  private canMakeRequest(): boolean {
    return this.requestCount < this.dailyLimit * 0.9; // Use 90% of limit
  }

  private incrementRequestCount(): void {
    this.requestCount++;
  }

  /**
   * Cache management for rate limiting
   */
  private async cacheRecommendations(style: string, products: FurnitureProduct[]): Promise<void> {
    try {
      const cacheKey = `furniture_recommendations_${style}`;
      const cacheData = {
        products,
        timestamp: Date.now(),
        ttl: 24 * 60 * 60 * 1000 // 24 hours
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache recommendations:', error);
    }
  }

  private async getCachedRecommendations(style: string): Promise<FurnitureProduct[]> {
    try {
      const cacheKey = `furniture_recommendations_${style}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return [];
      
      const data = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > data.ttl;
      
      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return [];
      }
      
      return data.products || [];
    } catch (error) {
      console.warn('Failed to get cached recommendations:', error);
      return [];
    }
  }

  /**
   * Price formatting utility
   */
  formatPrice(product: FurnitureProduct): { 
    current: string; 
    original?: string; 
    hasDiscount: boolean 
  } {
    const current = product.discount_price || product.price;
    const hasDiscount = !!product.discount_price;
    
    return {
      current: `€${current.toFixed(2)}`,
      original: hasDiscount ? `€${product.price.toFixed(2)}` : undefined,
      hasDiscount
    };
  }

  /**
   * Stock status utility
   */
  getStockStatus(product: FurnitureProduct): {
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    message: string;
    available: boolean;
  } {
    if (product.stock === 0) {
      return { status: 'out_of_stock', message: 'Out of stock', available: false };
    } else if (product.stock <= 5) {
      return { status: 'low_stock', message: `Only ${product.stock} left`, available: true };
    } else {
      return { status: 'in_stock', message: 'In stock', available: true };
    }
  }
}

// Usage Examples:
// const furnitureAPI = new FurnitureAPIService();
// 
// // Get recommendations for modern living room
// const modern = await furnitureAPI.getRecommendationsForStyle('modern', 'living_room', 1000);
// 
// // Search for specific products
// const sofas = await furnitureAPI.searchProducts('sofa', { max_price: 800 });
// 
// // Get room-specific products
// const roomProducts = await furnitureAPI.getProductsForRoom(
//   'living_room', 
//   { length: 4, width: 3, height: 2.5 }, 
//   'modern', 
//   1500
// );

// Export singleton instance
export const furnitureAPI = new FurnitureAPIService();
