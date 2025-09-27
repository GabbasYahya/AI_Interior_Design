import { useState } from "react";
import { HeroButton } from "@/components/ui/hero-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Ruler, ArrowRight, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Measurements = () => {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState({
    width: "",
    height: "",
    depth: "",
    roomType: "",
    notes: ""
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get style profile from localStorage
    const styleProfile = JSON.parse(localStorage.getItem('adariz_style_profile') || '{}');
    
    // Prepare measurements with converted numbers
    const formattedMeasurements = {
      width: parseFloat(measurements.width) || 0,
      height: parseFloat(measurements.height) || 0, 
      depth: parseFloat(measurements.depth) || 0,
      roomType: measurements.roomType,
      notes: measurements.notes
    };
    
    navigate('/room-generation', { 
      state: { 
        measurements: formattedMeasurements, 
        styleProfile,
        photo 
      } 
    });
  };  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Prise de mesures
            </h1>
            <p className="text-xl text-muted-foreground">
              Commençons par mesurer votre espace pour un design parfaitement adapté
            </p>
          </div>

          {/* Alert Info */}
          <Alert className="mb-8 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Prenez les mesures en mètres pour une précision optimale. La photo est optionnelle 
              mais nous aidera à mieux comprendre votre espace.
            </AlertDescription>
          </Alert>

          {/* Form */}
          <Card className="shadow-elegant bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-primary" />
                Dimensions de la pièce
              </CardTitle>
              <CardDescription>
                Renseignez les dimensions exactes de votre espace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Room Type */}
                <div className="space-y-2">
                  <Label htmlFor="roomType">Type de pièce</Label>
                  <Input
                    id="roomType"
                    placeholder="Ex: Salon, Chambre, Cuisine..."
                    value={measurements.roomType}
                    onChange={(e) => handleInputChange("roomType", e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                {/* Measurements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Largeur (m)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      placeholder="3.5"
                      value={measurements.width}
                      onChange={(e) => handleInputChange("width", e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Hauteur (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={measurements.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth">Profondeur (m)</Label>
                    <Input
                      id="depth"
                      type="number"
                      step="0.1"
                      placeholder="4.2"
                      value={measurements.depth}
                      onChange={(e) => handleInputChange("depth", e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Photo de la pièce (optionnel)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {photo ? photo.name : "Cliquez pour ajouter une photo"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes complémentaires</Label>
                  <Textarea
                    id="notes"
                    placeholder="Particularités de la pièce, contraintes, éléments existants..."
                    value={measurements.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>

                {/* Submit Button */}
                <HeroButton 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-warm text-white shadow-elegant transition-transform duration-300 hover:-translate-y-0.5"
                  disabled={!measurements.width || !measurements.height || !measurements.depth}
                >
                  Continuer vers la génération IA
                  <ArrowRight className="w-4 h-4" />
                </HeroButton>
              </form>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  1
                </div>
                <span className="font-medium text-foreground">Mesures</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs">
                  2
                </div>
                <span>Quiz de style</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs">
                  3
                </div>
                <span>Génération</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Measurements;