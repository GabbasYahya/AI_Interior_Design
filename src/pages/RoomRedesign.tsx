import { useState } from "react";
import { HeroButton } from "@/components/ui/hero-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Upload, Camera, ArrowRight, Image as ImageIcon, Wand2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const RoomRedesign = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [roomType, setRoomType] = useState("");
  const [designStyle, setDesignStyle] = useState("");

  const roomTypes = [
    "Living Room",
    "Bedroom", 
    "Kitchen",
    "Bathroom",
    "Dining Room",
    "Home Office",
    "Kids Room",
    "Media Room",
    "Patio",
    "Other"
  ];

  const designStyles = [
    "Modern",
    "Minimalist", 
    "Scandinavian",
    "Industrial",
    "Bohemian",
    "Classic",
    "Rustic",
    "Art Deco",
    "Contemporary",
    "Farmhouse",
    "Coastal",
    "Gothic",
    "Tropical"
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || !roomType || !designStyle) {
      alert("Please fill in all fields and upload a photo.");
      return;
    }
    
    // Process the redesign
    
    // Navigate to results or dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Redesign Your Room
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload a photo of your existing room and let our AI transform it with your chosen style preferences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload Section */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  Upload Room Photo
                </CardTitle>
                <CardDescription>
                  Take or upload a clear photo of the room you want to redesign. Make sure the room is well-lit and the main areas are visible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-white/50">
                  {photoPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={photoPreview} 
                        alt="Room preview" 
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <div className="flex items-center justify-center gap-4">
                        <p className="text-sm text-gray-600">Photo uploaded successfully!</p>
                        <HeroButton 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => document.getElementById('photo-input')?.click()}
                        >
                          Change Photo
                        </HeroButton>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drop your photo here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG, PNG, WebP (max 10MB)
                        </p>
                      </div>
                      <HeroButton 
                        type="button"
                        onClick={() => document.getElementById('photo-input')?.click()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Choose Photo
                      </HeroButton>
                    </div>
                  )}
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Room Type */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Room Type</CardTitle>
                  <CardDescription>
                    What type of room are you redesigning?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Design Style */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Design Style</CardTitle>
                  <CardDescription>
                    Choose your preferred design style for the redesign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={designStyle} onValueChange={setDesignStyle}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select design style" />
                    </SelectTrigger>
                    <SelectContent>
                      {designStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            {photo && roomType && designStyle && (
              <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <Wand2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Ready to redesign!</strong> Your {roomType.toLowerCase()} will be transformed with {designStyle.toLowerCase()} style.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <HeroButton 
                type="submit"
                size="lg"
                className="min-w-48 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                disabled={!photo || !roomType || !designStyle}
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Redesign
                <ArrowRight className="w-5 h-5 ml-2" />
              </HeroButton>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoomRedesign;
