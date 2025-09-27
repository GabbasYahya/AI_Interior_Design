import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import { 
  Camera, Eye, Download, Share2, Heart, RefreshCw, CheckCircle,
  ShoppingCart, Upload, Loader2, AlertTriangle
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { aiRoomService, RoomRequest, Room } from "../services/aiRoomGenerationService";
import { Product } from "../services/productService";

// Temporary interfaces for room generation (until full AI service is implemented)
interface RoomStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

interface RoomMeasurements {
  width: number;
  height: number;
  length: number;
  ceilingHeight: number;
  windowCount: number;
  doorCount: number;
}

interface GenerationRequest {
  originalImage: File;
  style: RoomStyle;
  measurements: RoomMeasurements;
  additionalPrompt: string;
}

interface GeneratedRoom {
  id: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  style: RoomStyle;
  measurements: RoomMeasurements;
  processingTime: number;
  confidence: number;
  designElements: string[];
  colorPalette: string[];
  prompt: string;
  createdAt: Date;
}

// Temporary service class for room generation
class AIRoomGenerationService {
  static getRoomStyles(): RoomStyle[] {
    return [
      {
        id: 'modern',
        name: 'Moderne',
        description: 'Style contemporain et épuré',
        imageUrl: '/placeholder.svg',
        tags: ['contemporain', 'minimaliste', 'épuré']
      },
      {
        id: 'boheme',
        name: 'Bohème',
        description: 'Style artistique et coloré',
        imageUrl: '/placeholder.svg',
        tags: ['artistique', 'coloré', 'créatif']
      },
      {
        id: 'scandinavian',
        name: 'Scandinave',
        description: 'Style nordique et chaleureux',
        imageUrl: '/placeholder.svg',
        tags: ['nordique', 'bois', 'naturel']
      },
      {
        id: 'industrial',
        name: 'Industriel',
        description: 'Style urbain et robuste',
        imageUrl: '/placeholder.svg',
        tags: ['urbain', 'métal', 'brut']
      }
    ];
  }

  static async generateRoom(request: GenerationRequest): Promise<GeneratedRoom> {
    // This will show the "Coming Soon" message from our service
    throw new Error('Génération IA - Fonctionnalité en développement!\n\nCette fonctionnalité avancée sera bientôt disponible.');
  }

  static async getRecommendedProducts(style: RoomStyle, measurements: RoomMeasurements): Promise<Product[]> {
    // Return empty array for now
    return [];
  }
}
import ECommerceService from "../services/ECommerceService";
import { toast } from "sonner";

const RoomGeneration: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<RoomStyle | null>(null);
  const [measurements, setMeasurements] = useState<RoomMeasurements>({
    width: 4,
    height: 3,
    length: 5,
    ceilingHeight: 2.5,
    windowCount: 2,
    doorCount: 1
  });
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generatedRoom, setGeneratedRoom] = useState<GeneratedRoom | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [roomStyles, setRoomStyles] = useState<RoomStyle[]>([]);

  // Initialize room styles
  useEffect(() => {
    const styles = AIRoomGenerationService.getRoomStyles();
    setRoomStyles(styles);
    if (styles.length > 0) {
      setSelectedStyle(styles[0]);
    }
  }, []);

  // Image upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        setError('L\'image doit faire moins de 10MB');
      } else if (error?.code === 'file-invalid-type') {
        setError('Format d\'image non supporté');
      } else {
        setError('Erreur lors du téléchargement de l\'image');
      }
    }
  });

  // Room generation
  const generateRoom = async () => {
    if (!selectedImage || !selectedStyle) {
      setError('Veuillez sélectionner une image et un style');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setCurrentStep('Préparation de la génération...');

    try {
      // Simulate progress steps
      const progressSteps = [
        { progress: 20, step: 'Analyse de l\'image...' },
        { progress: 40, step: 'Application du style...' },
        { progress: 60, step: 'Génération IA en cours...' },
        { progress: 80, step: 'Optimisation de la qualité...' },
        { progress: 90, step: 'Recherche de produits...' },
      ];

      for (const { progress, step } of progressSteps) {
        setProgress(progress);
        setCurrentStep(step);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const request: GenerationRequest = {
        originalImage: selectedImage,
        style: selectedStyle,
        measurements,
        additionalPrompt
      };

      const result = await AIRoomGenerationService.generateRoom(request);
      setGeneratedRoom(result);

      // Get product recommendations
      setCurrentStep('Recherche de produits recommandés...');
      const products = await AIRoomGenerationService.getRecommendedProducts(selectedStyle, measurements);
      setRecommendedProducts(products);

      setProgress(100);
      setCurrentStep('Génération terminée !');
      
      toast.success('Votre nouveau design a été généré avec succès !', {
        description: `Temps de traitement: ${(result.processingTime / 1000).toFixed(1)}s`
      });

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la génération');
      toast.error('Erreur lors de la génération', {
        description: 'Veuillez réessayer dans quelques instants'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Product actions
  const addToCart = (product: Product) => {
    ECommerceService.addToCart(product, 1);
    toast.success(`${product.name} ajouté au panier !`);
  };

  const addToWishlist = (product: Product) => {
    ECommerceService.addToWishlist(product);
    toast.success(`${product.name} ajouté à la wishlist !`);
  };

  // Image actions
  const downloadImage = async () => {
    if (!generatedRoom) return;
    
    try {
      const response = await fetch(generatedRoom.generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adariz-design-${generatedRoom.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image téléchargée avec succès !');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const shareImage = async () => {
    if (!generatedRoom) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mon design Adariz',
          text: `Découvrez mon nouveau design d'intérieur créé avec Adariz AI !`,
          url: window.location.href
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papiers !');
      }
    } catch (error) {
      toast.error('Erreur lors du partage');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Génération IA de Votre Intérieur
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transformez votre espace avec notre IA avancée. Téléchargez une photo de votre pièce, 
            choisissez un style et laissez notre technologie créer le design parfait avec les produits Adariz.
          </p>
        </div>

        {!generatedRoom ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Photo de Votre Pièce
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : selectedImage
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Image sélectionnée"
                          className="max-h-48 mx-auto rounded-lg object-cover"
                        />
                        <p className="text-green-600 font-medium">
                          {selectedImage.name}
                        </p>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                          }}
                        >
                          Changer l'image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            Glissez-déposez votre image ici
                          </p>
                          <p className="text-gray-500">
                            ou cliquez pour sélectionner (max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {error && (
                    <Alert className="mt-4" variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Style Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Style de Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {roomStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedStyle?.id === style.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedStyle(style)}
                      >
                        <h3 className="font-semibold text-sm">{style.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {style.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {style.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Measurements */}
              <Card>
                <CardHeader>
                  <CardTitle>Dimensions de la Pièce</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="width">Largeur (m)</Label>
                      <Input
                        id="width"
                        type="number"
                        min="1"
                        max="20"
                        step="0.1"
                        value={measurements.width}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          width: parseFloat(e.target.value) || 0
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="length">Longueur (m)</Label>
                      <Input
                        id="length"
                        type="number"
                        min="1"
                        max="20"
                        step="0.1"
                        value={measurements.length}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          length: parseFloat(e.target.value) || 0
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Hauteur plafond (m)</Label>
                      <Input
                        id="height"
                        type="number"
                        min="2"
                        max="5"
                        step="0.1"
                        value={measurements.ceilingHeight}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          ceilingHeight: parseFloat(e.target.value) || 0
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="windows">Nombre de fenêtres</Label>
                      <Input
                        id="windows"
                        type="number"
                        min="0"
                        max="10"
                        value={measurements.windowCount}
                        onChange={(e) => setMeasurements(prev => ({
                          ...prev,
                          windowCount: parseInt(e.target.value) || 0
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Prompt */}
              <Card>
                <CardHeader>
                  <CardTitle>Préférences Additionnelles (Optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Décrivez vos préférences spécifiques (couleurs, meubles, ambiance...)"
                    value={additionalPrompt}
                    onChange={(e) => setAdditionalPrompt(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Preview/Generation Panel */}
            <div className="space-y-6">
              {isGenerating ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Génération en cours...
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-600">{currentStep}</p>
                    <div className="text-center py-8">
                      <div className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg aspect-video"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Image originale"
                          className="w-full rounded-lg object-cover aspect-video"
                        />
                        <div className="text-center">
                          <Button
                            onClick={generateRoom}
                            disabled={!selectedImage || !selectedStyle}
                            size="lg"
                            className="px-8"
                          >
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Générer le Design
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Sélectionnez une image pour commencer</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Generated Room Results */
          <div className="space-y-8">
            {/* Images Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Image Originale</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={generatedRoom.originalImageUrl}
                    alt="Image originale"
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Design Généré</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadImage}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={shareImage}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={generatedRoom.generatedImageUrl}
                    alt="Design généré"
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Généré en {(generatedRoom.processingTime / 1000).toFixed(1)}s
                    </span>
                    <Badge variant="outline">{generatedRoom.style.name}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Design Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails du Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Style Appliqué</h3>
                    <p className="text-gray-600 mb-4">{generatedRoom.style.description}</p>
                    
                    <h3 className="font-semibold mb-2">Dimensions</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Surface: {generatedRoom.measurements.width}m × {generatedRoom.measurements.length}m</p>
                      <p>Hauteur: {generatedRoom.measurements.ceilingHeight}m</p>
                      <p>Fenêtres: {generatedRoom.measurements.windowCount}</p>
                      <p>Portes: {generatedRoom.measurements.doorCount}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Prompt IA Utilisé</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {generatedRoom.prompt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Recommendations */}
            {recommendedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Produits Recommandés</CardTitle>
                  <p className="text-gray-600">
                    Produits Adariz parfaitement adaptés à votre nouveau design
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square">
                          <img
                            src={product.images?.[0] || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-lg">
                              {product.price.toFixed(2)} {product.currency}
                            </span>
                            <Badge variant={product.in_stock ? "default" : "destructive"}>
                              {product.in_stock ? 'En stock' : 'Rupture'}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                              disabled={!product.in_stock}
                              className="flex-1"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Ajouter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToWishlist(product)}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedRoom(null);
                  setRecommendedProducts([]);
                  setSelectedImage(null);
                  setError(null);
                }}
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Nouveau Design
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                size="lg"
              >
                <Eye className="h-5 w-5 mr-2" />
                Voir Mes Designs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomGeneration;
