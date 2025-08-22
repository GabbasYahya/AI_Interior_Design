import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroButton } from "@/components/ui/hero-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCatalog from "@/components/ProductCatalog";
import { Plus, Home, Heart, Eye, Download, Calendar, Settings, Loader, Ruler, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthComponent } from "@/components/AuthComponent";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFavorites: 0,
    totalGenerations: 0,
    totalMeasurements: 0
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Dashboard loading timeout, switching to demo mode');
      loadDemoData();
    }, 8000);

    // Check if we have environment variables for Supabase
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL === 'your-supabase-url' || SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
      // Demo mode - load sample data immediately
      clearTimeout(timeout);
      loadDemoData();
      return;
    }

    if (!loading) {
      clearTimeout(timeout);
      if (user) {
        fetchUserData();
      } else {
        setLoadingData(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [user, loading]);

  const loadDemoData = () => {
    // Sample demo data
    const demoProjects = [
      {
        id: '1',
        name: 'Living Room Redesign',
        room_type: 'Living Room',
        style_preference: 'Modern',
        status: 'completed',
        created_at: new Date().toISOString(),
        room_measurements: [{ id: '1' }, { id: '2' }]
      },
      {
        id: '2', 
        name: 'Master Bedroom',
        room_type: 'Bedroom',
        style_preference: 'Scandinavian',
        status: 'in_progress',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        room_measurements: [{ id: '3' }]
      }
    ];

    const demoFavorites = [
      {
        id: '1',
        created_at: new Date().toISOString()
      }
    ];

    setProjects(demoProjects);
    setFavoriteProducts(demoFavorites);
    setStats({
      totalProjects: demoProjects.length,
      totalFavorites: demoFavorites.length,
      totalGenerations: 5,
      totalMeasurements: 3
    });
    setLoadingData(false);
  };

  const fetchUserData = async () => {
    try {
      setLoadingData(true);
      
      // Add timeout for data fetching
      const dataTimeout = setTimeout(() => {
        console.warn('Data fetch timeout, falling back to demo mode');
        loadDemoData();
      }, 5000);
      
      // Fetch user projects with room measurements
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          room_measurements(id)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      clearTimeout(dataTimeout);

      if (projectsError && projectsError.code !== 'PGRST116') {
        throw projectsError;
      }

      // Fetch favorite products
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user?.id);

      if (favoritesError && favoritesError.code !== 'PGRST116') {
        console.warn('Error fetching favorites, continuing without favorites data:', favoritesError);
      }

      // Fetch AI design generations count (temporarily set to 0 until AI features are implemented)
      const generationsCount = 0;

      // Calculate total measurements across all projects
      const totalMeasurements = projectsData?.reduce((total, project) => {
        return total + (project.room_measurements?.length || 0);
      }, 0) || 0;

      setProjects(projectsData || []);
      setFavoriteProducts(favoritesData || []);
      setStats({
        totalProjects: projectsData?.length || 0,
        totalFavorites: favoritesData?.length || 0,
        totalGenerations: generationsCount || 0,
        totalMeasurements: totalMeasurements
      });
    } catch (error) {
      console.error('Error fetching user data, falling back to demo mode:', error);
      loadDemoData();
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-sage-green text-foreground";
      case "in_progress": return "bg-primary-warm text-foreground";
      case "draft": return "bg-warm-grey text-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Terminé";
      case "in_progress": return "En cours";
      case "draft": return "Brouillon";
      default: return status;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader className="w-8 h-8 animate-spin mr-2" />
            <span>Chargement de votre tableau de bord...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Accès Restreint</h1>
            <p className="text-muted-foreground mb-8">
              Vous devez être connecté pour accéder à votre tableau de bord.
            </p>
            <AuthComponent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Dashboard */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-muted-foreground">
                Bonjour {profile?.full_name || user.email}, gérez vos projets et suivez vos designs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Crédits restants</p>
                <p className="text-2xl font-bold text-primary">{profile?.credits || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft bg-gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Projets totaux</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Favoris</p>
                  <p className="text-2xl font-bold">{stats.totalFavorites}</p>
                </div>
                <div className="w-12 h-12 bg-primary-accent/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Générations</p>
                  <p className="text-2xl font-bold">{stats.totalGenerations}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mesures totales</p>
                  <p className="text-2xl font-bold">{stats.totalMeasurements}</p>
                </div>
                <div className="w-12 h-12 bg-sage-green/10 rounded-lg flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-sage-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Mes projets
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Catalogue
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favoris
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes Projets</h2>
              <div className="flex gap-2">
                <HeroButton onClick={() => navigate('/measurements')} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />
                  Create New Room
                </HeroButton>
                <HeroButton variant="outline" onClick={() => navigate('/room-redesign')}>
                  <Camera className="w-4 h-4" />
                  Redesign Room
                </HeroButton>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun projet pour le moment</h3>
                  <p className="text-muted-foreground mb-6">
                    Créez votre premier projet pour commencer à concevoir vos espaces
                  </p>
                  <HeroButton onClick={() => navigate('/new-project')}>
                    <Plus className="w-4 h-4" />
                    Créer mon premier projet
                  </HeroButton>
                </div>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0 group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
                        <Home className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>
                        {project.room_type} • Style {project.style_preference}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span>{project.room_measurements?.length || 0} mesure(s)</span>
                      </div>
                      <div className="flex gap-2">
                        <HeroButton variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4" />
                          Voir
                        </HeroButton>
                        <HeroButton variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </HeroButton>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Catalogue de Meubles
                  </CardTitle>
                  <CardDescription>
                    Découvrez notre sélection de meubles avec des produits réels et des recommandations personnalisées
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ProductCatalog 
                    userStyle={(profile?.preferences as any)?.style || 'modern'}
                    className="p-6"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-2xl font-bold">Mes Produits Favoris</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun favori pour le moment</h3>
                  <p className="text-muted-foreground mb-6">
                    Explorez nos recommandations de produits et ajoutez vos préférés
                  </p>
                  <HeroButton>
                    Découvrir les produits
                  </HeroButton>
                </div>
              ) : (
                favoriteProducts.map((favorite) => (
                  <Card key={favorite.id} className="shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-40 bg-muted/50 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <HeroButton 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-3 right-3 w-8 h-8 p-0 bg-background/80 hover:bg-background"
                      >
                        <Heart className="w-4 h-4 text-primary-accent fill-primary-accent" />
                      </HeroButton>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        Produit favori
                      </CardTitle>
                      <CardDescription>
                        Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          À venir
                        </span>
                        <HeroButton size="sm">
                          Voir le produit
                        </HeroButton>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;