import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  style_tags: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  in_stock: boolean;
  brand: string;
  materials?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  style?: string;
  inStock?: boolean;
  search?: string;
}

class ProductService {
  
  // Mock products for demo purposes
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Canapé Moderne 3 Places',
      description: 'Canapé confortable avec design contemporain',
      price: 1299.99,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
      category: 'Canapés',
      style_tags: ['modern', 'minimalist'],
      dimensions: { width: 210, height: 85, depth: 90 },
      in_stock: true,
      brand: 'ADARIZ',
      materials: ['Tissu', 'Bois']
    },
    {
      id: '2',
      name: 'Table Basse Design',
      description: 'Table basse élégante avec rangement',
      price: 399.99,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'],
      category: 'Tables',
      style_tags: ['modern', 'scandinavian'],
      dimensions: { width: 120, height: 45, depth: 60 },
      in_stock: true,
      brand: 'ADARIZ',
      materials: ['Bois', 'Métal']
    },
    {
      id: '3',
      name: 'Fauteuil Scandinave',
      description: 'Fauteuil confortable style nordique',
      price: 549.99,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80'],
      category: 'Fauteuils',
      style_tags: ['scandinavian', 'cozy'],
      dimensions: { width: 80, height: 90, depth: 85 },
      in_stock: true,
      brand: 'ADARIZ',
      materials: ['Tissu', 'Bois']
    },
    {
      id: '4',
      name: 'Lampadaire Industrial',
      description: 'Lampadaire style industriel en métal',
      price: 189.99,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'],
      category: 'Éclairage',
      style_tags: ['industrial', 'urban'],
      dimensions: { width: 30, height: 160, depth: 30 },
      in_stock: true,
      brand: 'ADARIZ',
      materials: ['Métal']
    },
    {
      id: '5',
      name: 'Tapis Bohème',
      description: 'Tapis coloré style bohème',
      price: 299.99,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80'],
      category: 'Décoration',
      style_tags: ['bohemian', 'colorful'],
      dimensions: { width: 200, height: 1, depth: 300 },
      in_stock: true,
      brand: 'ADARIZ',
      materials: ['Laine']
    },
    {
      id: '6',
      name: 'Bibliothèque Classique',
      description: 'Bibliothèque élégante en bois noble',
      price: 899.99,
      currency: 'EUR',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
      category: 'Rangement',
      style_tags: ['luxury-classic', 'elegant'],
      dimensions: { width: 120, height: 200, depth: 35 },
      in_stock: true,
      brand: 'ADARIZ',
      materials: ['Bois']
    }
  ];

  async getProductsByStyle(style: string): Promise<Product[]> {
    try {
      // Return mock products filtered by style
      return this.mockProducts.filter(product => 
        product.style_tags.some(tag => tag.includes(style.toLowerCase()))
      );
    } catch (error) {
      console.error('Error fetching products by style:', error);
      return this.mockProducts.slice(0, 3); // Return first 3 as fallback
    }
  }

  async getRecommendedProducts(style: string, roomArea: number): Promise<Product[]> {
    try {
      const styleProducts = await this.getProductsByStyle(style);
      
      // Filter products that fit in the room
      return styleProducts.filter(product => {
        if (!product.dimensions) return true;
        
        const productArea = (product.dimensions.width / 100) * (product.dimensions.depth / 100); // Convert cm to m
        return productArea <= (roomArea * 0.3); // Product should occupy max 30% of room
      }).slice(0, 6); // Limit to 6 products
      
    } catch (error) {
      console.error('Error getting recommended products:', error);
      return this.mockProducts.slice(0, 6);
    }
  }

  async searchProducts(filters: ProductFilters): Promise<Product[]> {
    try {
      let filteredProducts = [...this.mockProducts];

      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }

      if (filters.style) {
        filteredProducts = filteredProducts.filter(p => 
          p.style_tags.some(tag => tag.includes(filters.style!.toLowerCase()))
        );
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.in_stock === filters.inStock);
      }

      return filteredProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      return this.mockProducts;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return this.mockProducts.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  }

  async getRelatedProducts(productId: string): Promise<Product[]> {
    try {
      const product = await this.getProductById(productId);
      if (!product) return [];

      // Find products with similar style tags or same category
      return this.mockProducts
        .filter(p => 
          p.id !== productId && (
            p.category === product.category ||
            p.style_tags.some(tag => product.style_tags.includes(tag))
          )
        )
        .slice(0, 4);
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return this.mockProducts;
  }

  async getCategories(): Promise<string[]> {
    const categories = [...new Set(this.mockProducts.map(p => p.category))];
    return categories;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // Return first 4 products as featured
    return this.mockProducts.slice(0, 4);
  }
}

export default new ProductService();