import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { HeroButton } from '../components/ui/hero-button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  brand: string;
  tags: string[];
}

// Mock products data - fallback if Supabase is not available
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Canapé Moderne Gris',
    description: 'Canapé 3 places en tissu gris moderne avec pieds en bois',
    price: 899,
    category: 'furniture',
    image_url: '/api/placeholder/300/300',
    rating: 4.5,
    reviews_count: 32,
    in_stock: true,
    brand: 'ModernHome',
    tags: ['moderne', 'confortable', 'salon']
  },
  {
    id: '2',
    name: 'Table Basse Scandinave',
    description: 'Table basse en bois naturel style scandinave',
    price: 299,
    category: 'furniture',
    image_url: '/api/placeholder/300/300',
    rating: 4.8,
    reviews_count: 18,
    in_stock: true,
    brand: 'NordicDesign',
    tags: ['scandinave', 'bois', 'naturel']
  },
  {
    id: '3',
    name: 'Lampe Design LED',
    description: 'Lampe de bureau LED avec variateur d\'intensité',
    price: 149,
    category: 'lighting',
    image_url: '/api/placeholder/300/300',
    rating: 4.3,
    reviews_count: 45,
    in_stock: false,
    brand: 'LightCraft',
    tags: ['led', 'bureau', 'moderne']
  },
  {
    id: '4',
    name: 'Tapis Berbère Authentique',
    description: 'Tapis berbère fait main en laine naturelle',
    price: 549,
    category: 'decor',
    image_url: '/api/placeholder/300/300',
    rating: 4.9,
    reviews_count: 12,
    in_stock: true,
    brand: 'Artisan',
    tags: ['berbère', 'laine', 'authentique']
  }
];

class ProductCatalogService {
  static async getProducts(): Promise<Product[]> {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      const dataPromise = supabase
        .from('products')
        .select('*');
      
      const { data, error } = await Promise.race([dataPromise, timeoutPromise]);
      
      if (error) {
        console.warn('Error fetching products from Supabase, using mock data:', error);
        return mockProducts;
      }
      
      return data || mockProducts;
    } catch (error) {
      console.warn('Supabase not available or timeout, using mock data:', error);
      return mockProducts;
    }
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => product.category === category);
  }
}

const ProductCard: React.FC<{ product: Product; viewMode: 'grid' | 'list' }> = ({ product, viewMode }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  if (viewMode === 'list') {
    return (
      <Card className="flex flex-row overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="w-48 h-32 bg-gray-200 flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwVjIwME0xMDAgMTUwSDE1MEgxNzVIMjAwIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE0Ij5JbWFnZTwvdGV4dD4KPC9zdmc+';
            }}
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
              <span className="text-sm text-gray-400 ml-1">({product.reviews_count})</span>
            </div>
            <Badge variant={product.in_stock ? "default" : "secondary"}>
              {product.in_stock ? 'En stock' : 'Rupture'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-emerald-600">{product.price}€</span>
            <div className="flex gap-2">
              <HeroButton
                variant="outline"
                size="sm"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </HeroButton>
              <HeroButton size="sm" disabled={!product.in_stock}>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Ajouter
              </HeroButton>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="aspect-square bg-gray-200 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwVjIwME0xMDAgMTUwSDE1MEgxNzVIMjAwIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE0Ij5JbWFnZTwvdGV4dD4KPC9zdmc+';
            }}
          />
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Rupture de stock</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            <span className="text-sm text-gray-400 ml-1">({product.reviews_count})</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-emerald-600">{product.price}€</span>
          <span className="text-sm text-gray-500">{product.brand}</span>
        </div>
        <div className="flex gap-2">
          <HeroButton
            variant="outline"
            size="sm"
            onClick={() => navigate(`/products/${product.id}`)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Voir
          </HeroButton>
          <HeroButton size="sm" disabled={!product.in_stock} className="flex-1">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Ajouter
          </HeroButton>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await ProductCatalogService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'furniture', label: 'Mobilier' },
    { value: 'lighting', label: 'Éclairage' },
    { value: 'decor', label: 'Décoration' },
    { value: 'storage', label: 'Rangement' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom A-Z' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
          <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Notre Catalogue Produits
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Découvrez une sélection exceptionnelle de mobilier et décoration 
            pour transformer votre intérieur
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <ProductCatalog />
      </div>
    </div>
  );
};

export default Products;
