import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ShoppingCart, Heart, Star, Filter, Search } from 'lucide-react';
import { furnitureAPI, type FurnitureProduct } from '@/services/furnitureAPIService';

interface ProductCatalogProps {
  userStyle?: string;
  roomType?: string;
  budget?: { min: number; max: number };
  className?: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  userStyle = 'modern',
  roomType,
  budget,
  className = ''
}) => {
  const [products, setProducts] = useState<FurnitureProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FurnitureProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<FurnitureProduct | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [showInStock, setShowInStock] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'newest'>('newest');

  // Load initial data
  useEffect(() => {
    loadProducts();
  }, [userStyle, roomType, budget]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, priceRange, showInStock, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productData = await furnitureAPI.getFeaturedProducts(50);
      setProducts(productData);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      filtered = filtered.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
      );
    }

    // Stock filter
    if (showInStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product: FurnitureProduct) => {
    setSelectedProduct(product);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setShowInStock(true);
    setSortBy('newest');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const categories = ['sofa', 'chair', 'stool', 'table', 'desk', 'kitchen', 'vanitory', 'matress', 'mirror', 'wardrove', 'lamp', 'tv table', 'garden'];

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to Load Products</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadProducts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Furniture Catalog</h2>
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>
        <Button variant="outline" onClick={resetFilters}>
          <Filter className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: 'price' | 'name' | 'newest') => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="inStock" className="text-sm">In stock only</label>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Min Price</label>
            <Input
              type="number"
              placeholder="$0"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <Input
              type="number"
              placeholder="No limit"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
          <Button variant="outline" onClick={resetFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <img
                  src={product.image_path}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                {product.discount_price && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                  </Badge>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">
                      {formatPrice(product.discount_price || product.price)}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="p-2">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button size="sm" disabled={product.stock === 0} className="p-2">
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  <Badge variant="outline" className="text-xs">{product.wood_type}</Badge>
                  <Badge variant="outline" className="text-xs">{product.finish}</Badge>
                </div>

                {product.stock > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ In stock ({product.stock} available)
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.image_path}
                    alt={selectedProduct.name}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold">
                      {formatPrice(selectedProduct.discount_price || selectedProduct.price)}
                    </span>
                    {selectedProduct.discount_price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(selectedProduct.price)}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700">{selectedProduct.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span> {selectedProduct.category}
                    </div>
                    <div>
                      <span className="font-medium">Wood Type:</span> {selectedProduct.wood_type}
                    </div>
                    <div>
                      <span className="font-medium">Finish:</span> {selectedProduct.finish}
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span> {selectedProduct.weight} kg
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Dimensions:</span> {' '}
                    {selectedProduct.dimensions.width}cm W × {selectedProduct.dimensions.height}cm H × {selectedProduct.dimensions.depth}cm D
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={selectedProduct.stock === 0}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {selectedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    <Button variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>

                  {selectedProduct.stock > 0 && (
                    <p className="text-sm text-green-600">
                      ✓ In stock ({selectedProduct.stock} available)
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCatalog;
