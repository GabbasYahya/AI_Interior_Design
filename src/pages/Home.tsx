import * as React from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { HeroButton } from "../components/ui/hero-button";
import { 
  Camera, Wand2, 
  Home as HomeIcon, Bed, ChefHat, Bath, UtensilsCrossed, Laptop, 
  Baby, Monitor, Shirt, Sofa, BedDouble,
  Droplets, TreePine, Palette, Sparkles, ShoppingBag, Users,
  Ruler,
  PaletteIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState("Gothic");

  const designStyles = [
    { name: "Tropical", bgColor: "from-green-400 to-green-600", image: "/images/styles/Tropical.png" },
    { name: "Art Deco", bgColor: "from-yellow-400 to-yellow-600", image: "/images/styles/art deco.png" },
    { name: "Minimalist", bgColor: "from-gray-300 to-gray-500", image: "/images/styles/Minimalist.png" },
    { name: "Maximalist", bgColor: "from-red-400 to-red-600", image: "/images/styles/Maximalist.png" },
    { name: "Gothic", bgColor: "from-purple-600 to-purple-800", image: "/images/styles/gothic.png" },
    { name: "French Country", bgColor: "from-blue-300 to-blue-500", image: "/images/styles/french country.png" },
    { name: "Cosmic Chic", bgColor: "from-indigo-400 to-indigo-600", image: "/images/styles/Cosmic Chic.png" },
    { name: "Hollywood Regency", bgColor: "from-pink-400 to-pink-600", image: "/images/styles/Hollywood Regency.png" },
    { name: "Farmhouse", bgColor: "from-amber-300 to-amber-500", image: "/images/styles/FarmHouse.png" },
    { name: "Transitional", bgColor: "from-teal-400 to-teal-600", image: "/images/styles/Transitional.png" },
    { name: "Coastal", bgColor: "from-blue-400 to-blue-600", image: "/images/styles/coastal beach.png" },
    { name: "Psychedelic", bgColor: "from-rainbow-400 to-rainbow-600", image: "/images/styles/psychedelic.png" },
    { name: "Moroccan", bgColor: "from-orange-400 to-orange-600", image: "/images/styles/Moroccan.png" },
    { name: "Candy Land", bgColor: "from-pink-300 to-pink-500", image: "/images/styles/Candy Land.png" },
    { name: "Scandinavian", bgColor: "from-blue-200 to-blue-400", image: "/images/styles/scandinavian.png" },
    { name: "Post-Apocalyptic", bgColor: "from-gray-700 to-gray-900", image: "/images/styles/post apocalyptic.png" }
  ];

  const roomTypes = [
    { name: "Salle de bain", icon: Bath },
    { name: "Salle à manger", icon: UtensilsCrossed },
    { name: "Bureau", icon: Laptop },
    { name: "Chambre enfant", icon: Baby },
    { name: "Salle multimédia", icon: Monitor },
    { name: "Entrée", icon: Shirt },
    { name: "Terrasse", icon: TreePine },
    { name: "Buanderie", icon: Droplets },
    { name: "Salle de sport", icon: Sparkles }
  ];

  const colorPalettes = [
    { name: "Neutres doux", colors: ["#F5F5F5", "#E8E8E8", "#D3D3D3", "#FFFFFF"] },
    { name: "Calme côtier", colors: ["#A8DADC", "#F1FAEE", "#E63946", "#457B9D"] },
    { name: "Lumières nordiques", colors: ["#FFFFFF", "#F7F9FC", "#8B5A2B", "#2D3748"] },
    { name: "Retraite forestière", colors: ["#606C38", "#FEFAE0", "#DDA15E", "#BC6C25"] },
    { name: "Hiver glacé", colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261"] },
    { name: "Brise marine", colors: ["#219EBC", "#8ECAE6", "#FFB3BA", "#023047"] }
  ];

  const materials = [
    { name: "Terrazzo", type: "Stone" },
    { name: "Cherry", type: "Wood" },
    { name: "Walnut", type: "Wood" },
    { name: "Steel", type: "Metal" },
    { name: "Rosewood", type: "Wood" },
    { name: "Chrome", type: "Metal" },
    { name: "Mirrored", type: "Glass" },
    { name: "Copper", type: "Metal" },
    { name: "Basalt", type: "Stone" },
    { name: "Colored Glass", type: "Glass" },
    { name: "Stainless Steel", type: "Metal" },
    { name: "Frosted", type: "Glass" },
    { name: "Birch", type: "Wood" },
    { name: "Wool", type: "Fabrics" },
    { name: "Tempered", type: "Glass" },
    { name: "Mahogany", type: "Wood" },
    { name: "Silver", type: "Metal" },
    { name: "Oak", type: "Wood" },
    { name: "Clear", type: "Glass" },
    { name: "Marble", type: "Wood" }
  ];
  const features = [
    {
      icon: Ruler,
      title: "Prise de mesures",
      description: "Saisissez facilement les dimensions de votre pièce avec notre interface intuitive"
    },
    {
      icon: Palette,
      title: "Quiz de style",
      description: "Découvrez votre style unique grâce à notre questionnaire personnalisé"
    },
    {
      icon: Sparkles,
      title: "Génération IA",
      description: "Visualisez votre intérieur grâce à l'intelligence artificielle avancée"
    },
    {
      icon: ShoppingBag,
      title: "Produits adaptés",
      description: "Recevez des suggestions de mobilier parfaitement adaptées à votre espace"
    }
  ];

  const testimonials = [
    {
      name: "Sophie Martin",
      comment: "Incroyable ! J'ai pu visualiser ma cuisine avant même d'acheter quoi que ce soit.",
      rating: 5
    },
    {
      name: "Thomas Dubois", 
      comment: "L'IA comprend parfaitement mon style. Les suggestions sont spot-on !",
      rating: 5
    },
    {
      name: "Marie Chen",
      comment: "Interface super intuitive, résultats professionnels. Je recommande !",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-slate-800">
            Transformez vos espaces avec
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent"> l'IA</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Design d'intérieur personnalisé et intelligent. Visualisez, personnalisez 
            et donnez vie à vos rêves de décoration en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <HeroButton 
              onClick={() => navigate('/measurements')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Commencer gratuitement
            </HeroButton>
            <HeroButton 
              onClick={() => navigate('/style-quiz')}
              variant="outline"
              className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300"
            >
              Découvrir mon style
            </HeroButton>
            <HeroButton 
              onClick={() => navigate('/products')}
              variant="outline"
              className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300"
            >
              Voir les produits
            </HeroButton>
          </div>
        </div>
      </section>

      {/* Style Selection Gallery */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Explorez nos styles de design</h2>
          <p className="text-slate-600 mb-4">Cliquez sur un style pour l'essayer</p>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide">
          {designStyles.map((style, index) => (
            <div
              key={index}
              onClick={() => setSelectedStyle(style.name)}
              className={`relative flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedStyle === style.name ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <img 
                src={style.image} 
                alt={style.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient + emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }}
              />
              <div className={`w-full h-full bg-gradient-to-br ${style.bgColor} hidden items-center justify-center`}>
                <span className="text-3xl">
                  {style.name === "Tropical" ? "🌴" :
                   style.name === "Art Deco" ? "✨" :
                   style.name === "Minimalist" ? "🏢" :
                   style.name === "Maximalist" ? "🎨" :
                   style.name === "Gothic" ? "🏰" :
                   style.name === "French Country" ? "🏡" :
                   style.name === "Cosmic Chic" ? "🌌" :
                   style.name === "Hollywood Regency" ? "💎" :
                   style.name === "Farmhouse" ? "🌾" :
                   style.name === "Transitional" ? "🏠" :
                   style.name === "Coastal" ? "🌊" :
                   style.name === "Psychedelic" ? "🎭" :
                   style.name === "Moroccan" ? "🕌" :
                   style.name === "Candy Land" ? "🍭" :
                   style.name === "Scandinavian" ? "❄️" :
                   style.name === "Post-Apocalyptic" ? "⚡" : "🎨"}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-center">
                <span className="text-sm font-medium">{style.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Style Discovery Section - Enhanced */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Découvrez Votre Style Unique
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Répondez à notre quiz personnalisé et laissez l'IA créer un profil de style sur-mesure pour votre intérieur
              </p>
            </div>

            {/* Interactive Style Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Style Personnel</h3>
                  <p className="text-gray-600 mb-4">
                    Identifiez vos préférences esthétiques parmi 16 styles de design différents
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Mode de Vie</h3>
                  <p className="text-gray-600 mb-4">
                    Analysez comment vous vivez votre espace pour des recommandations adaptées
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Profil IA</h3>
                  <p className="text-gray-600 mb-4">
                    Obtenez un profil personnalisé généré par IA pour guider tous vos projets
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quiz Preview */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-xl">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Quiz Interactif Personnalisé
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    En seulement 6 questions, découvrez votre style unique et recevez des recommandations 
                    personnalisées pour transformer votre intérieur selon vos goûts et votre mode de vie.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-gray-700">6 questions sur vos préférences</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Analyse IA de votre profil</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Recommandations personnalisées</span>
                    </div>
                  </div>
                  <HeroButton 
                    onClick={() => navigate('/style-quiz')}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white border-0 shadow-lg"
                  >
                    <Palette className="w-5 h-5 mr-2" />
                    Commencer le Quiz de Style
                  </HeroButton>
                </div>
                
                <div className="flex-1 lg:max-w-md">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl p-6 border border-emerald-200">
                      <h4 className="font-semibold text-gray-800 mb-4">Aperçu de Question</h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              🛋️
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">Style Moderne</div>
                              <div className="text-sm text-gray-600">Lignes épurées, design contemporain</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 opacity-60">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              🌿
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">Style Bohème</div>
                              <div className="text-sm text-gray-600">Couleurs chaudes, textures naturelles</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="flex items-start gap-4 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Résultats Instantanés</h4>
                  <p className="text-gray-600">
                    Obtenez immédiatement votre profil de style et commencez à visualiser votre projet
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Produits Recommandés</h4>
                  <p className="text-gray-600">
                    Recevez des suggestions de meubles et décoration adaptés à votre style
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Restyle Card */}
          <Card className="bg-gradient-to-br from-emerald-700 to-emerald-600 border-emerald-500 text-white overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm bg-emerald-500 px-2 py-1 rounded text-white font-medium">Relooking</span>
                  <h3 className="text-2xl font-bold mt-1">Transformez votre pièce existante</h3>
                </div>
              </div>
              <p className="text-emerald-100 mb-6 text-lg">
                Téléchargez une image de votre pièce et notre IA la redécorera selon vos préférences de design.
              </p>
              <div className="w-full h-48 bg-emerald-800/50 rounded-lg mb-6 overflow-hidden relative">
                <div className="flex w-full h-full">
                  <img 
                    src="/images/cards/Before_Ai.png" 
                    alt="Avant redesign IA"
                    className="w-1/2 h-full object-cover border-r-2 border-white"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <img 
                    src="/images/cards/After_Ai.png" 
                    alt="Après redesign IA"
                    className="w-1/2 h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 rounded px-2 py-1">
                  <p className="text-xs text-white text-center">Avant → Après Transformation</p>
                </div>
              </div>
              <HeroButton 
                onClick={() => navigate('/room-redesign')} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Relooker une pièce existante
              </HeroButton>
            </CardContent>
          </Card>

          {/* Generate Card */}
          <Card className="bg-gradient-to-br from-blue-700 to-blue-600 border-blue-500 text-white overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm bg-blue-500 px-2 py-1 rounded text-white font-medium">Génération</span>
                  <h3 className="text-2xl font-bold mt-1">Concevez une nouvelle pièce</h3>
                </div>
              </div>
              <p className="text-blue-100 mb-6 text-lg">
                Spécifiez vos préférences de design et générez facilement des dizaines de rendus photo-réalistes.
              </p>
              <div className="w-full h-32 bg-blue-800/50 rounded-lg mb-6 overflow-hidden relative">
                <div className="grid grid-cols-3 gap-2 w-full h-full">
                  <img 
                    src="/images/cards/bedroom.jpg" 
                    alt="Chambre générée"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <img 
                    src="/images/cards/Dinningroom.jpg" 
                    alt="Salle à manger générée"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <img 
                    src="/images/cards/sitting room.jpg" 
                    alt="Salon généré"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 rounded px-2 py-1">
                  <p className="text-xs text-white text-center">Designs générés par IA</p>
                </div>
              </div>
              <HeroButton 
                onClick={() => navigate('/measurements')} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0"
                size="lg"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Créer un nouveau design
              </HeroButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Selection Interface */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Rooms */}
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Pièces</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Quel que soit le type de pièce que vous concevez, nous avons ce qu'il vous faut.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {roomTypes.map((room, index) => {
                  const Icon = room.icon;
                  return (
                    <button
                      key={index}
                      className="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group border border-gray-700"
                    >
                      <Icon className="w-6 h-6 text-gray-400 group-hover:text-white mb-2" />
                      <span className="text-xs text-gray-400 group-hover:text-white text-center leading-tight">
                        {room.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <PaletteIcon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Colors</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Choose your own colors, or have AI generate a color palette that matches your style and room.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colorPalettes.map((palette, index) => (
                  <button
                    key={index}
                    className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                        {palette.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {palette.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-8 h-6 rounded flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Materials */}
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Matériaux</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Testez des dizaines de matériaux pour voir comment ils rendraient dans votre intérieur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {materials.slice(0, 12).map((material, index) => (
                  <button
                    key={index}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group text-left border border-gray-700"
                  >
                    <div className="text-sm font-medium text-gray-300 group-hover:text-white">
                      {material.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {material.type}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Prêt à transformer votre intérieur ?
            </h2>
            <p className="text-xl text-emerald-100">
              Rejoignez des milliers d'utilisateurs qui ont déjà créé l'espace de leurs rêves
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HeroButton 
                size="lg" 
                className="min-w-48 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg" 
                onClick={() => navigate('/measurements')}
              >
                <Sparkles className="w-5 h-5" />
                Commencer gratuitement
              </HeroButton>
              <HeroButton 
                variant="outline" 
                size="lg" 
                className="min-w-48 border-emerald-400 text-emerald-100 hover:bg-emerald-800/50" 
                onClick={() => navigate('/products')}
              >
                <ShoppingBag className="w-5 h-5" />
                Parcourir les produits
              </HeroButton>
              <HeroButton 
                variant="outline" 
                size="lg" 
                className="min-w-48 border-2 border-emerald-400 text-emerald-100 hover:bg-emerald-800/50 hover:border-emerald-300 font-semibold transition-all duration-300" 
                onClick={() => navigate('/style-quiz')}
              >
                <Palette className="w-5 h-5 mr-2" />
                Découvrir mon style
              </HeroButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;