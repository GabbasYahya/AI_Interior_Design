import { useState } from "react";
import { 
  Camera, Wand2, 
  Home as HomeIcon, Bed, ChefHat, Bath, UtensilsCrossed, Laptop, 
  Baby, Monitor, Shirt, Sofa, BedDouble,
  Droplets, TreePine, Palette, Sparkles, ShoppingBag, Users,
  Ruler
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
    { name: "Tons chauds", colors: ["#D2B48C", "#DEB887", "#F4A460", "#CD853F"] },
    { name: "Bleus océan", colors: ["#E0F6FF", "#87CEEB", "#4682B4", "#1E3A8A"] },
    { name: "Verts nature", colors: ["#F0FDF4", "#BBF7D0", "#22C55E", "#15803D"] },
    { name: "Roses modernes", colors: ["#FDF2F8", "#FBBF24", "#EC4899", "#BE185D"] },
    { name: "Monochromes", colors: ["#000000", "#374151", "#9CA3AF", "#F9FAFB"] }
  ];

  const materials = [
    "Bois naturel", "Métal brossé", "Pierre naturelle", "Verre", "Tissu", "Cuir", "Marbre", "Béton"
  ];

  const testimonials = [
    {
      name: "Marie D.",
      comment: "Incroyable ! Mon salon a été complètement transformé en quelques minutes.",
      rating: 5
    },
    {
      name: "Pierre L.",
      comment: "Les suggestions de couleurs étaient parfaites pour ma cuisine.",
      rating: 5
    },
    {
      name: "Sophie M.",
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
            <button 
              onClick={() => navigate('/measurements')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Commencer gratuitement
            </button>
            <button 
              onClick={() => navigate('/style-quiz')}
              className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300"
            >
              Découvrir mon style
            </button>
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
              className={`min-w-[200px] h-32 rounded-lg bg-gradient-to-r ${style.bgColor} cursor-pointer relative overflow-hidden transition-all duration-300 ${
                selectedStyle === style.name 
                  ? 'ring-4 ring-emerald-500 scale-105' 
                  : 'hover:scale-102 hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <h3 className="text-white text-lg font-bold text-center px-2">{style.name}</h3>
              </div>
              {selectedStyle === style.name && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-emerald-600 font-medium">Style sélectionné: {selectedStyle}</p>
        </div>
      </section>

      {/* Main Action Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Restyle Card */}
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 border border-emerald-500 text-white overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-xl rounded-lg">
            <div className="p-8">
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
              <button 
                onClick={() => navigate('/room-redesign')} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Relooker une pièce existante
              </button>
            </div>
          </div>

          {/* Generate Card */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-600 border border-blue-500 text-white overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-xl rounded-lg">
            <div className="p-8">
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
              <button 
                onClick={() => navigate('/measurements')} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Créer un nouveau design
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Selection Interface */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Rooms */}
          <div className="bg-gray-900 border border-gray-700 text-white rounded-lg">
            <div className="pb-4 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Pièces</h3>
              </div>
              <p className="text-gray-300">
                Quel que soit le type de pièce que vous concevez, nous avons ce qu'il vous faut.
              </p>
            </div>
            <div className="p-6 pt-0">
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
            </div>
          </div>

          {/* Colors */}
          <div className="bg-gray-900 border border-gray-700 text-white rounded-lg">
            <div className="pb-4 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Couleurs</h3>
              </div>
              <p className="text-gray-300">
                Sélectionnez une palette de couleurs qui correspond à votre style.
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-3">
                {colorPalettes.map((palette, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                    <div className="flex gap-1">
                      {palette.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-300">{palette.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-gray-900 border border-gray-700 text-white rounded-lg">
            <div className="pb-4 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Matériaux</h3>
              </div>
              <p className="text-gray-300">
                Choisissez les matériaux qui donneront vie à votre design.
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-2">
                {materials.map((material, index) => (
                  <button
                    key={index}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-300 hover:text-white border border-gray-700"
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à transformer votre espace ?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Rejoignez des milliers d'utilisateurs qui ont déjà révolutionné leur intérieur
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/measurements')} 
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Commencer maintenant
            </button>
            <button 
              onClick={() => navigate('/style-quiz')} 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Découvrir mon style
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          Ce que disent nos utilisateurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Sparkles key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">"{testimonial.comment}"</p>
              <p className="text-slate-800 font-semibold">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
