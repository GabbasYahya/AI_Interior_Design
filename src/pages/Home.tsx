import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { HeroButton } from "../components/ui/hero-button";
import {
  Baby,
  Bath,
  Camera,
  Droplets,
  Home as HomeIcon,
  Laptop,
  Monitor,
  Palette,
  Palette as PaletteIcon,
  ShoppingBag,
  Shirt,
  Sparkles,
  TreePine,
  Users,
  UtensilsCrossed,
  Wand2
} from "lucide-react";

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
    icon: Camera,
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

const Home = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = React.useState<string>("Gothic");

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto flex max-w-4xl flex-col space-y-8">
          <h1 className="font-sans text-4xl font-extrabold leading-tight text-[#000000] md:text-6xl">
            Transformez vos espaces avec
            <span className="ml-2 inline-block rounded-full bg-[#20B2AA]/10 px-3 py-1 text-3xl font-semibold text-[#20B2AA] md:text-5xl">
              l'IA
            </span>
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-xl text-[#333333]">
            Design d'intérieur personnalisé et intelligent. Visualisez, personnalisez et donnez vie à vos rêves de décoration en quelques clics.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <HeroButton
              onClick={() => navigate("/measurements")}
              className="rounded-full border-0 bg-[#20B2AA] px-8 py-4 font-sans text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#18958F]"
            >
              Commencer gratuitement
            </HeroButton>
            <HeroButton
              onClick={() => navigate("/style-quiz")}
              variant="outline"
              className="rounded-full border-2 border-[#20B2AA] px-8 py-4 font-sans text-lg font-semibold text-[#20B2AA] transition-all duration-300 hover:bg-[#20B2AA]/10"
            >
              Découvrir mon style
            </HeroButton>
            <HeroButton
              onClick={() => navigate("/products")}
              variant="outline"
              className="rounded-full border-2 border-[#000000] px-8 py-4 font-sans text-lg font-semibold text-[#000000] transition-all duration-300 hover:bg-black/5"
            >
              Voir les produits
            </HeroButton>
          </div>
        </div>
      </section>

      {/* Style Selection Gallery */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold text-[#000000]">Explorez nos styles de design</h2>
          <p className="font-sans text-base text-[#333333]">Cliquez sur un style pour l'essayer</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {designStyles.map((style) => (
            <div
              key={style.name}
              onClick={() => setSelectedStyle(style.name)}
              className={`relative h-32 w-48 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                selectedStyle === style.name ? "ring-2 ring-[#20B2AA]" : ""
              }`}
            >
              <img
                src={style.image}
                alt={style.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  const target = event.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className={`hidden h-full w-full items-center justify-center bg-gradient-to-br ${style.bgColor}`}>
                <span className="text-3xl">
                  {style.name === "Tropical"
                    ? "🌴"
                    : style.name === "Art Deco"
                    ? "✨"
                    : style.name === "Minimalist"
                    ? "🏢"
                    : style.name === "Maximalist"
                    ? "🎨"
                    : style.name === "Gothic"
                    ? "🏰"
                    : style.name === "French Country"
                    ? "🏡"
                    : style.name === "Cosmic Chic"
                    ? "🌌"
                    : style.name === "Hollywood Regency"
                    ? "💎"
                    : style.name === "Farmhouse"
                    ? "🌾"
                    : style.name === "Transitional"
                    ? "🏠"
                    : style.name === "Coastal"
                    ? "🌊"
                    : style.name === "Psychedelic"
                    ? "🎭"
                    : style.name === "Moroccan"
                    ? "🕌"
                    : style.name === "Candy Land"
                    ? "🍭"
                    : style.name === "Scandinavian"
                    ? "❄️"
                    : style.name === "Post-Apocalyptic"
                    ? "⚡"
                    : "🎨"}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-center text-white">
                <span className="font-sans text-sm font-semibold">{style.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Style Discovery Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-sans text-4xl font-extrabold text-[#000000] md:text-5xl">
                Découvrez Votre Style Unique
              </h2>
              <p className="mx-auto max-w-3xl font-sans text-lg text-[#333333]">
                Répondez à notre quiz personnalisé et laissez l'IA créer un profil de style sur-mesure pour votre intérieur
              </p>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="group border border-[#E5E7EB] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#20B2AA]/15 transition-transform duration-300 group-hover:scale-110">
                    <Palette className="h-8 w-8 text-[#20B2AA]" />
                  </div>
                  <h3 className="mb-3 font-sans text-xl font-semibold text-[#000000]">Style Personnel</h3>
                  <p className="mb-4 font-sans text-sm text-[#333333]">Identifiez vos préférences esthétiques parmi 16 styles de design différents</p>
                  <div className="flex justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#20B2AA]" />
                    <div className="h-3 w-3 rounded-full bg-[#18958F]" />
                    <div className="h-3 w-3 rounded-full bg-[#0F6F6B]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group border border-[#E5E7EB] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#20B2AA]/15 transition-transform duration-300 group-hover:scale-110">
                    <Users className="h-8 w-8 text-[#20B2AA]" />
                  </div>
                  <h3 className="mb-3 font-sans text-xl font-semibold text-[#000000]">Mode de Vie</h3>
                  <p className="mb-4 font-sans text-sm text-[#333333]">Analysez comment vous vivez votre espace pour des recommandations adaptées</p>
                  <div className="flex justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#20B2AA]" />
                    <div className="h-3 w-3 rounded-full bg-[#18958F]" />
                    <div className="h-3 w-3 rounded-full bg-[#0F6F6B]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group border border-[#E5E7EB] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#20B2AA]/15 transition-transform duration-300 group-hover:scale-110">
                    <Sparkles className="h-8 w-8 text-[#20B2AA]" />
                  </div>
                  <h3 className="mb-3 font-sans text-xl font-semibold text-[#000000]">Profil IA</h3>
                  <p className="mb-4 font-sans text-sm text-[#333333]">Obtenez un profil personnalisé généré par IA pour guider tous vos projets</p>
                  <div className="flex justify-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#20B2AA]" />
                    <div className="h-3 w-3 rounded-full bg-[#18958F]" />
                    <div className="h-3 w-3 rounded-full bg-[#0F6F6B]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-lg">
              <div className="flex flex-col items-center gap-8 lg:flex-row">
                <div className="flex-1">
                  <h3 className="mb-4 font-sans text-2xl font-semibold text-[#000000]">Quiz Interactif Personnalisé</h3>
                  <p className="mb-6 font-sans text-base text-[#333333]">
                    En seulement 6 questions, découvrez votre style unique et recevez des recommandations personnalisées pour transformer votre intérieur selon vos goûts et votre mode de vie.
                  </p>
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#20B2AA]" />
                      <span className="font-sans text-sm text-[#333333]">6 questions sur vos préférences</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#18958F]" />
                      <span className="font-sans text-sm text-[#333333]">Analyse IA de votre profil</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#0F6F6B]" />
                      <span className="font-sans text-sm text-[#333333]">Recommandations personnalisées</span>
                    </div>
                  </div>
                  <HeroButton
                    onClick={() => navigate("/style-quiz")}
                    size="lg"
                    className="border-0 bg-[#20B2AA] font-sans text-white shadow-lg transition hover:bg-[#18958F]"
                  >
                    <Palette className="mr-2 h-5 w-5" /> Commencer le Quiz de Style
                  </HeroButton>
                </div>

                <div className="flex-1 lg:max-w-md">
                  <div className="relative">
                    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-6">
                      <h4 className="mb-4 font-sans text-lg font-semibold text-[#000000]">Aperçu de Question</h4>
                      <div className="space-y-3">
                        <div className="cursor-pointer rounded-lg border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#20B2AA]">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#20B2AA]/15">🛋️</div>
                            <div>
                              <div className="font-sans text-sm font-semibold text-[#000000]">Style Moderne</div>
                              <div className="font-sans text-xs text-[#333333]">Lignes épurées, design contemporain</div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 opacity-60">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#20B2AA]/15">🌿</div>
                            <div>
                              <div className="font-sans text-sm font-semibold text-[#000000]">Style Bohème</div>
                              <div className="font-sans text-xs text-[#333333]">Couleurs chaudes, textures naturelles</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#20B2AA] text-xs font-bold text-white">1</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <Sparkles className="h-6 w-6 text-[#20B2AA]" />
                </div>
                <div>
                  <h4 className="mb-2 font-sans text-lg font-semibold text-[#000000]">Résultats Instantanés</h4>
                  <p className="font-sans text-sm text-[#333333]">Obtenez immédiatement votre profil de style et commencez à visualiser votre projet</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <ShoppingBag className="h-6 w-6 text-[#20B2AA]" />
                </div>
                <div>
                  <h4 className="mb-2 font-sans text-lg font-semibold text-[#000000]">Produits Recommandés</h4>
                  <p className="font-sans text-sm text-[#333333]">Recevez des suggestions de meubles et décoration adaptés à votre style</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="group overflow-hidden border border-[#E5E7EB] bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <Camera className="h-6 w-6 text-[#20B2AA]" />
                </div>
                <div>
                  <span className="rounded-full bg-[#20B2AA]/15 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-[#20B2AA]">
                    Relooking
                  </span>
                  <h3 className="mt-2 font-sans text-2xl font-semibold text-[#000000]">Transformez votre pièce existante</h3>
                </div>
              </div>
              <p className="mb-6 font-sans text-base text-[#333333]">
                Téléchargez une image de votre pièce et notre IA la redécorera selon vos préférences de design.
              </p>
              <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#031e22] via-[#06363a] to-[#0f4d48]">
                <div className="flex h-full w-full">
                  <img
                    src="/images/cards/Before_Ai.png"
                    alt="Avant redesign IA"
                    className="h-full w-1/2 border-r-2 border-white object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <img
                    src="/images/cards/After_Ai.png"
                    alt="Après redesign IA"
                    className="h-full w-1/2 object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="absolute bottom-2 left-2 right-2 rounded bg-black/70 px-2 py-1 text-center font-sans text-xs text-white">
                  Avant → Après Transformation
                </div>
              </div>
              <HeroButton
                onClick={() => navigate("/room-redesign")}
                className="w-full border-0 bg-[#20B2AA] font-sans text-white hover:bg-[#18958F]"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" /> Relooker une pièce existante
              </HeroButton>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border border-[#E5E7EB] bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <Wand2 className="h-6 w-6 text-[#20B2AA]" />
                </div>
                <div>
                  <span className="rounded-full bg-[#20B2AA]/15 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-[#20B2AA]">
                    Génération
                  </span>
                  <h3 className="mt-2 font-sans text-2xl font-semibold text-[#000000]">Concevez une nouvelle pièce</h3>
                </div>
              </div>
              <p className="mb-6 font-sans text-base text-[#333333]">
                Spécifiez vos préférences de design et générez facilement des dizaines de rendus photo-réalistes.
              </p>
              <div className="relative mb-6 grid h-32 w-full grid-cols-3 gap-2 overflow-hidden rounded-lg bg-[#F1F5F9]">
                <img
                  src="/images/cards/bedroom.jpg"
                  alt="Chambre générée"
                  className="h-full w-full rounded object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/images/cards/Dinningroom.jpg"
                  alt="Salle à manger générée"
                  className="h-full w-full rounded object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <img
                  src="/images/cards/sitting room.jpg"
                  alt="Salon généré"
                  className="h-full w-full rounded object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute bottom-2 left-2 right-2 rounded bg-black/70 px-2 py-1 text-center font-sans text-xs text-white">
                  Designs générés par IA
                </div>
              </div>
              <HeroButton
                onClick={() => navigate("/measurements")}
                className="w-full border-0 bg-[#20B2AA] font-sans text-white hover:bg-[#18958F]"
                size="lg"
              >
                <Wand2 className="mr-2 h-5 w-5" /> Créer un nouveau design
              </HeroButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Selection Interface */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="border border-[#E5E7EB] bg-white text-[#333333] shadow-sm">
            <CardHeader className="pb-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <HomeIcon className="h-5 w-5 text-[#20B2AA]" />
                </div>
                <CardTitle className="font-sans text-xl font-semibold text-[#000000]">Pièces</CardTitle>
              </div>
              <CardDescription className="font-sans text-sm text-[#555555]">
                Quel que soit le type de pièce que vous concevez, nous avons ce qu'il vous faut.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {roomTypes.map((room) => {
                  const Icon = room.icon;
                  return (
                    <button
                      key={room.name}
                      className="group flex flex-col items-center rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[#20B2AA]"
                    >
                      <Icon className="mb-2 h-6 w-6 text-[#20B2AA]" />
                      <span className="font-sans text-center text-xs font-medium leading-tight text-[#333333] group-hover:text-[#20B2AA]">
                        {room.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E5E7EB] bg-white text-[#333333] shadow-sm">
            <CardHeader className="pb-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <PaletteIcon className="h-5 w-5 text-[#20B2AA]" />
                </div>
                <CardTitle className="font-sans text-xl font-semibold text-[#000000]">Couleurs</CardTitle>
              </div>
              <CardDescription className="font-sans text-sm text-[#555555]">
                Choisissez vos couleurs ou laissez l'IA générer une palette adaptée à votre style et votre pièce.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.name}
                    className="group w-full rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:border-[#20B2AA]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-sans text-sm font-semibold text-[#333333] group-hover:text-[#20B2AA]">
                        {palette.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {palette.colors.map((color) => (
                        <div key={color} className="h-6 flex-1 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E5E7EB] bg-white text-[#333333] shadow-sm">
            <CardHeader className="pb-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <Sparkles className="h-5 w-5 text-[#20B2AA]" />
                </div>
                <CardTitle className="font-sans text-xl font-semibold text-[#000000]">Matériaux</CardTitle>
              </div>
              <CardDescription className="font-sans text-sm text-[#555555]">
                Testez des dizaines de matériaux pour voir comment ils rendraient dans votre intérieur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {materials.slice(0, 12).map((material) => (
                  <button
                    key={material.name}
                    className="group rounded-lg border border-[#E5E7EB] bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#20B2AA]"
                  >
                    <div className="font-sans text-sm font-semibold text-[#333333] group-hover:text-[#20B2AA]">
                      {material.name}
                    </div>
                    <div className="mt-1 font-sans text-xs text-[#555555]">{material.type}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border border-[#E5E7EB] bg-white/95 shadow-soft">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6FAF7]">
                  <feature.icon className="h-6 w-6 text-[#0f766e]" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-800">Témoignages</h2>
          <p className="text-slate-600">Nos utilisateurs adorent les résultats</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-none bg-white/90 shadow-md">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-1 text-[#0f766e]">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Sparkles key={`${testimonial.name}-rating-${index}`} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">“{testimonial.comment}”</p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-wide text-[#0f766e]">Utilisateur vérifié</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Get Started Section */}
      <section className="bg-gradient-to-br from-[#010103] via-[#07101a] to-[#05211f] text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Prêt à transformer votre intérieur ?</h2>
            <p className="text-xl text-[#9de8e0]">Rejoignez des milliers d'utilisateurs qui ont déjà créé l'espace de leurs rêves</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <HeroButton
                size="lg"
                className="min-w-48 border-0 bg-gradient-warm text-white shadow-elegant"
                onClick={() => navigate("/measurements")}
              >
                <Sparkles className="h-5 w-5" /> Commencer gratuitement
              </HeroButton>
              <HeroButton
                variant="outline"
                size="lg"
                className="min-w-48 border border-white/40 text-white hover:bg-white/10"
                onClick={() => navigate("/products")}
              >
                <ShoppingBag className="h-5 w-5" /> Parcourir les produits
              </HeroButton>
              <HeroButton
                variant="outline"
                size="lg"
                className="min-w-48 border-2 border-white/60 font-semibold text-white transition-all duration-300 hover:bg-white/10"
                onClick={() => navigate("/style-quiz")}
              >
                <Palette className="mr-2 h-5 w-5" /> Découvrir mon style
              </HeroButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
