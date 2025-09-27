import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { HeroButton } from '../components/ui/hero-button';
import { Badge } from '../components/ui/badge';
import productService from '../services/productService';
import { supabase } from '../integrations/supabase/client';
import { 
  ShoppingBag, Heart, Share2, ArrowLeft, 
  Truck, Shield, RotateCcw, Star,
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Using productService instead of catalogService

  useEffect(() => {
    if (id) {
      loadProductDetails();
    }
  }, [id]);

  const loadProductDetails = async () => {
    setLoading(true);
    try {
      const product = await productService.getProductById(id!);
      const relatedProducts = await productService.getRelatedProducts(id!);
      const details = {
        product,
        relatedProducts,
        alternativeColors: []
      };
      if (details) {
        setProduct(details.product);
        setRelatedProducts(details.relatedProducts);
      } else {
        // Load mock data if not found
        setProduct(getMockProduct());
        setRelatedProducts(getMockRelatedProducts());
      }
    } catch (error) {
      console.error('Failed to load product details:', error);
      setProduct(getMockProduct());
      setRelatedProducts(getMockRelatedProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProduct = () => ({
    id: id,
    name: 'Canapé Moderne Sectionnaire',
    description: 'Canapé en forme de L contemporain avec lignes épurées et coussins moelleux. Parfait pour les espaces de vie modernes.',
    price: 1299.99,
    currency: 'EUR',
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/401',
      '/api/placeholder/600/402',
      '/api/placeholder/600/403'
    ],
    colors: ['gris', 'bleu marine', 'beige'],
    materials: ['tissu', 'bois', 'métal'],
    style_tags: ['moderne', 'contemporain', 'minimaliste'],
    availability_status: 'available',
    dimensions: { width: 250, height: 85, depth: 180, unit: 'cm' },
    metadata: {
      weight: 45,
      suitable_rooms: ['salon', 'salle de séjour'],
      warranty: '2 ans',
      delivery_time: '2-4 semaines'
    }
  });

  const getMockRelatedProducts = () => [
    {
      id: '2',
      name: 'Table Basse Scandinave',
      price: 399.99,
      currency: 'EUR',
      images: ['/api/placeholder/300/200']
    },
    {
      id: '3',
      name: 'Fauteuil Design',
      price: 649.99,
      currency: 'EUR',
      images: ['/api/placeholder/300/200']
    }
  ];

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20B2AA] mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Produit non trouvé</h2>
          <HeroButton onClick={() => navigate('/products')}>
            Retour aux produits
          </HeroButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <HeroButton 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux produits
          </HeroButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={product.images[currentImageIndex] || '/api/placeholder/600/400'}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/600/400';
                  }}
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 hover:bg-white text-gray-600'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-[#20B2AA]' 
                        : 'border-gray-200 hover:border-[#20B2AA]/40'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/80/80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.style_tags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                {product.name}
              </h1>
              
              <div className="text-3xl font-bold text-[#0f766e] mb-4">
                {product.price} {product.currency}
              </div>

              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spécifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-slate-700">Dimensions:</span>
                    <p className="text-slate-600">
                      {product.dimensions?.width}×{product.dimensions?.height}×{product.dimensions?.depth} {product.dimensions?.unit}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Poids:</span>
                    <p className="text-slate-600">{product.metadata?.weight} kg</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-slate-700">Matériaux:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.materials?.map((material: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-slate-700">Couleurs disponibles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.colors?.map((color: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Actions */}
            <div className="space-y-4">
              <HeroButton className="w-full" size="lg">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ajouter au panier
              </HeroButton>
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                  <Truck className="w-5 h-5 text-[#0f766e]" />
                  <span className="text-slate-600">Livraison {product.metadata?.delivery_time}</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                  <Shield className="w-5 h-5 text-[#0f766e]" />
                  <span className="text-slate-600">Garantie {product.metadata?.warranty}</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                  <RotateCcw className="w-5 h-5 text-[#0f766e]" />
                  <span className="text-slate-600">Retour 30j</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card 
                  key={relatedProduct.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <div className="relative">
                    <img
                      src={relatedProduct.images[0] || '/api/placeholder/300/200'}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/200';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-1">
                      {relatedProduct.name}
                    </CardTitle>
                    <div className="text-xl font-bold text-[#0f766e]">
                      {relatedProduct.price} {relatedProduct.currency}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
