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
      setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
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
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const categories = [
    'sofa',
    'chair',
    'table',
    'desk',
    'lamp',
    'kitchen',
    'bed',
    'stool',
    'rug',
    'shelf',
    'lighting',
    'bench',
    'storage',
    'wardrobe',
    'mirror',
    'tv table',
    'garden',
    'decor'
  ];

  const categoryLabels: Record<string, string> = {
    sofa: 'Canapé',
    chair: 'Chaise',
    table: 'Table',
    desk: 'Bureau',
    lamp: 'Lampe',
    kitchen: 'Cuisine',
    bed: 'Lit',
    stool: 'Tabouret',
    rug: 'Tapis',
    shelf: 'Étagère',
    lighting: 'Luminaire',
    bench: 'Banc',
    storage: 'Rangement',
    wardrobe: 'Armoire',
    mirror: 'Miroir',
    'tv table': 'Meuble TV',
    garden: 'Jardin',
    decor: 'Décoration'
  };

  const formatCategoryLabel = (value: string) =>
    categoryLabels[value.toLowerCase()] ?? value
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

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
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-lg font-semibold">Chargement impossible</h3>
        <p className="mb-4 text-gray-600">{error}</p>
        <Button onClick={loadProducts}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-soft">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-[#0f172a]">Catalogue sélectionné</h2>
          <p className="text-sm text-[#475569]">
            {filteredProducts.length} pièces correspondant à votre recherche
          </p>
        </div>
        <Button
          variant="outline"
          onClick={resetFilters}
          className="border-[#20B2AA] text-[#0f766e] hover:bg-[#20B2AA]/10"
        >
          <Filter className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-soft">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#94a3b8]" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#dce3f3] bg-white placeholder:text-[#94a3b8] focus-visible:ring-[#20B2AA]"
            />
          </div>

          {/* Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="border-[#dce3f3] bg-white text-[#0f172a] hover:bg-[#f8fafc] focus:ring-[#20B2AA]">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent className="border border-[#dce3f3] bg-white text-[#0f172a]">
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {formatCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: 'price' | 'name' | 'newest') => setSortBy(value)}>
            <SelectTrigger className="border-[#dce3f3] bg-white text-[#0f172a] hover:bg-[#f8fafc] focus:ring-[#20B2AA]">
              <SelectValue placeholder="Trier" />
            </SelectTrigger>
            <SelectContent className="border border-[#dce3f3] bg-white text-[#0f172a]">
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="name">Nom A-Z</SelectItem>
              <SelectItem value="price">Prix croissant</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="rounded border-[#cbd5f5] accent-[#20B2AA]"
            />
            <label htmlFor="inStock" className="text-sm text-[#1f2937]">Uniquement en stock</label>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1f2937]">Prix minimum</label>
            <Input
              type="number"
              placeholder="0 €"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="border-[#dce3f3] bg-white placeholder:text-[#94a3b8] focus-visible:ring-[#20B2AA]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1f2937]">Prix maximum</label>
            <Input
              type="number"
              placeholder="Sans limite"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="border-[#dce3f3] bg-white placeholder:text-[#94a3b8] focus-visible:ring-[#20B2AA]"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-[#475569]">Aucun produit ne correspond à vos filtres actuels.</p>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="border-[#20B2AA] text-[#0f766e] hover:bg-[#20B2AA]/10"
          >
            Effacer les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="cursor-pointer overflow-hidden border border-[#E2E8F0] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
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
                  <Badge className="absolute top-2 right-2 bg-[#fee2e2] text-[#b91c1c]">
                    -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                  </Badge>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Badge variant="destructive">Rupture de stock</Badge>
                  </div>
                )}
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-[#fef08a] text-[#92400e]">
                    Coup de cœur
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="mb-2 line-clamp-2 text-xs text-[#4b5563]">{product.description}</p>

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
                    <Button size="sm" variant="outline" className="border-[#E2E8F0] p-2 text-[#1f2937] hover:bg-[#f1f5f9]">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button size="sm" disabled={product.stock === 0} className="bg-[#20B2AA] p-2 text-white hover:bg-[#18958F] disabled:bg-gray-300">
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary" className="text-xs capitalize">{formatCategoryLabel(product.category)}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{product.wood_type}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{product.finish}</Badge>
                </div>

                {product.stock > 0 && (
                  <p className="mt-1 text-xs text-[#0f766e]">
                    ✓ En stock ({product.stock} disponibles)
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-[#E2E8F0] bg-white text-[#0f172a] shadow-float">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-[#0f172a]">
                  {selectedProduct.name}
                </DialogTitle>
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
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-3xl font-semibold text-[#0f172a]">
                      {formatPrice(selectedProduct.discount_price || selectedProduct.price)}
                    </span>
                    {selectedProduct.discount_price && (
                      <span className="text-lg text-[#94a3b8] line-through">
                        {formatPrice(selectedProduct.price)}
                      </span>
                    )}
                  </div>

                  <p className="text-[#475569]">{selectedProduct.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm text-[#475569]">
                    <div>
                      <span className="font-medium text-[#0f172a]">Catégorie :</span> {formatCategoryLabel(selectedProduct.category)}
                    </div>
                    <div>
                      <span className="font-medium text-[#0f172a]">Matériau principal :</span> {selectedProduct.wood_type}
                    </div>
                    <div>
                      <span className="font-medium text-[#0f172a]">Finition :</span> {selectedProduct.finish}
                    </div>
                    <div>
                      <span className="font-medium text-[#0f172a]">Poids :</span> {selectedProduct.weight} kg
                    </div>
                  </div>

                  <div className="text-[#475569]">
                    <span className="font-medium text-[#0f172a]">Dimensions :</span>{' '}
                    {selectedProduct.dimensions.width} cm (L) × {selectedProduct.dimensions.height} cm (H) × {selectedProduct.dimensions.depth} cm (P)
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-[#20B2AA] text-white hover:bg-[#18958F]"
                      disabled={selectedProduct.stock === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {selectedProduct.stock > 0 ? 'Ajouter au panier' : 'Épuisé'}
                    </Button>
                    <Button variant="outline" className="border-[#E2E8F0] text-[#0f172a] hover:bg-[#f1f5f9]">
                      <Heart className="mr-2 h-4 w-4" />
                      Enregistrer
                    </Button>
                  </div>

                  {selectedProduct.stock > 0 && (
                    <p className="text-sm text-[#0f766e]">
                      ✓ En stock ({selectedProduct.stock} disponibles)
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
