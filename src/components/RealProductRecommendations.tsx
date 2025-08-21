// Real Furniture Product Recommendations using Furniture API
// Replaces mock data with real furniture catalog

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExternalLink, ShoppingCart, Heart, Info, AlertCircle } from 'lucide-react';
import { FurnitureAPIService, FurnitureProduct } from '../services/furnitureAPIService';

interface RealProductRecommendationsProps {
  style?: string;
  roomType?: string;
  budget?: number;
  projectId?: string;
  measurements?: {
    length: number;
    width: number;
    height: number;
  };
}

export const RealProductRecommendations: React.FC<RealProductRecommendationsProps> = ({ 
  style = 'modern',
  roomType = 'living_room',
  budget,
  measurements
}) => {
  const [products, setProducts] = useState<FurnitureProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<FurnitureProduct | null>(null);
  
  const furnitureAPI = new FurnitureAPIService();

  useEffect(() => {
    loadRecommendations();
  }, [style, roomType, budget]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError('');
    
    try {
      let recommendations: FurnitureProduct[];
      
      if (measurements) {
        // Get room-specific recommendations
        recommendations = await furnitureAPI.getProductsForRoom(
          roomType, 
          measurements, 
          style, 
          budget
        );
      } else {
        // Get style-based recommendations
        recommendations = await furnitureAPI.getRecommendationsForStyle(
          style, 
          roomType, 
          budget
        );
      }

      setProducts(recommendations);
      
      if (recommendations.length === 0) {
        setError('No products found for your criteria. Try adjusting your style or budget.');
      }
      
    } catch (err) {
      setError('Failed to load recommendations. Please try again later.');
      console.error('Recommendation loading failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: FurnitureProduct) => {
    const stockStatus = furnitureAPI.getStockStatus(product);
    
    if (!stockStatus.available) {
      alert('Sorry, this product is out of stock.');
      return;
    }

    // Simple alert for now - replace with your cart implementation
    const price = product.discount_price || product.price;
    alert(`Added "${product.name}" to cart\nPrice: €${price.toFixed(2)}\n\nIntegrate this with your shopping cart system.`);
  };

  const openProductDetails = (product: FurnitureProduct) => {
    setSelectedProduct(product);
  };

  const formatPrice = (product: FurnitureProduct) => {
    return furnitureAPI.formatPrice(product);
  };

  const getStockBadge = (product: FurnitureProduct) => {
    const status = furnitureAPI.getStockStatus(product);
    
    const variants = {
      'in_stock': 'default',
      'low_stock': 'destructive',
      'out_of_stock': 'secondary'
    } as const;

    return (
      <Badge variant={variants[status.status]} className="text-xs">
        {status.message}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Loading furniture recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <Button onClick={loadRecommendations} className="mt-4" variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Furniture Recommendations
            <Badge variant="outline">{products.length} products</Badge>
          </CardTitle>
          <div className="text-sm text-gray-600">
            <p>Professional furniture for your {style} {roomType.replace('_', ' ')}</p>
            {budget && <p>Budget: Up to €{budget}</p>}
            {measurements && (
              <p>Room: {measurements.length}m × {measurements.width}m</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => {
              const pricing = formatPrice(product);
              const stockStatus = furnitureAPI.getStockStatus(product);
              
              return (
                <div key={product.sku} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative">
                    <img 
                      src={product.image_path} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        Featured
                      </Badge>
                    )}
                    {pricing.hasDiscount && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        Sale
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {product.category} • {product.wood_type} • {product.finish}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-blue-600">
                        {pricing.current}
                      </span>
                      {pricing.original && (
                        <span className="text-sm text-gray-500 line-through">
                          {pricing.original}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between">
                      {getStockBadge(product)}
                      <span className="text-xs text-gray-500">
                        {product.dimensions.width}×{product.dimensions.depth}×{product.dimensions.height}cm
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openProductDetails(product)}
                        className="flex-1"
                      >
                        <Info className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddToCart(product)}
                        disabled={!stockStatus.available}
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {products.length > 0 && (
            <div className="text-center mt-6">
              <Button onClick={loadRecommendations} variant="outline">
                Refresh Recommendations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

// Product Details Modal Component
interface ProductDetailsModalProps {
  product: FurnitureProduct;
  onClose: () => void;
  onAddToCart: (product: FurnitureProduct) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const furnitureAPI = new FurnitureAPIService();
  const [similarProducts, setSimilarProducts] = useState<FurnitureProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimilarProducts();
  }, [product]);

  const loadSimilarProducts = async () => {
    try {
      const similar = await furnitureAPI.getSimilarProducts(product);
      setSimilarProducts(similar.slice(0, 3)); // Show top 3
    } catch (error) {
      console.error('Failed to load similar products:', error);
    } finally {
      setLoading(false);
    }
  };

  const pricing = furnitureAPI.formatPrice(product);
  const stockStatus = furnitureAPI.getStockStatus(product);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{product.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div>
              <img 
                src={product.image_path} 
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{pricing.current}</h3>
                {pricing.original && (
                  <p className="text-gray-500 line-through">{pricing.original}</p>
                )}
              </div>

              <div className="space-y-2">
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Material:</strong> {product.wood_type}</p>
                <p><strong>Finish:</strong> {product.finish}</p>
                <p><strong>Weight:</strong> {product.weight}kg</p>
                <p><strong>Dimensions:</strong> {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} cm</p>
              </div>

              <div className="flex items-center space-x-2">
                <strong>Stock:</strong>
                <Badge variant={stockStatus.status === 'in_stock' ? 'default' : 'destructive'}>
                  {stockStatus.message}
                </Badge>
              </div>

              <p className="text-gray-600">{product.description}</p>

              <div className="flex gap-2">
                <Button 
                  onClick={() => onAddToCart(product)}
                  disabled={!stockStatus.available}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Similar Products</h3>
            {loading ? (
              <div className="text-center py-4">Loading similar products...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarProducts.map(similar => (
                  <div key={similar.sku} className="border rounded-lg p-3">
                    <img 
                      src={similar.image_path} 
                      alt={similar.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h4 className="font-medium text-sm">{similar.name}</h4>
                    <p className="text-blue-600 font-bold">
                      €{(similar.discount_price || similar.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
