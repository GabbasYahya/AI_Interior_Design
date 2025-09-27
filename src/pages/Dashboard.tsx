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
import { userDashboardService, UserProject, UserFavorite, DashboardStats } from "@/services/userDashboardService";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<UserFavorite[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalFavorites: 0,
    totalGenerations: 0,
    totalMeasurements: 0
  });
  const [loadingData, setLoadingData] = useState(true);

  const handleRemoveFromFavorites = async (itemId: string, itemType: 'project' | 'ai_design' | 'photo' = 'project') => {
    if (!user?.id) return;
    
    try {
      const success = await userDashboardService.removeFromFavorites(user.id, itemId, itemType);
      if (success) {
        // Refresh favorites list
        const updatedFavorites = await userDashboardService.getUserFavorites(user.id);
        setFavoriteProducts(updatedFavorites);
        // Update stats
        setStats(prev => ({ ...prev, totalFavorites: updatedFavorites.length }));
      }
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!user?.id) return;
    
    const newProject = {
      user_id: user.id,
      name: 'Nouveau Projet',
      room_type: 'Living Room',
      style_preference: 'Modern',
      status: 'draft' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const createdProject = await userDashboardService.createProject(newProject);
      if (createdProject) {
        // Refresh projects list
        const updatedProjects = await userDashboardService.getUserProjects(user.id);
        setProjects(updatedProjects);
        setStats(prev => ({ ...prev, totalProjects: updatedProjects.length }));
        
        // Navigate to the project edit page
        navigate(`/project/${createdProject.id}/edit`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Dashboard loading timeout, showing empty state');
      loadEmptyState();
    }, 8000);

    // Check if we have environment variables for Supabase
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL === 'your-supabase-url' || SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
      // No Supabase configuration - show empty state with real data structure
      clearTimeout(timeout);
      loadEmptyState();
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

  const loadEmptyState = () => {
    // Initialize with empty real data instead of mock data
    setProjects([]);
    setFavoriteProducts([]);
    setStats({
      totalProjects: 0,
      totalFavorites: 0,
      totalGenerations: 0,
      totalMeasurements: 0
    });
    setLoadingData(false);
  };

  const fetchUserData = async () => {
    try {
      setLoadingData(true);
      
      if (!user?.id) {
        loadEmptyState();
        return;
      }

      // Add timeout for data fetching
      const dataTimeout = setTimeout(() => {
        console.warn('Data fetch timeout, showing empty state');
        loadEmptyState();
      }, 5000);
      
      // Use the real data service instead of direct Supabase calls
      const [projectsData, favoritesData, statsData] = await Promise.all([
        userDashboardService.getUserProjects(user.id),
        userDashboardService.getUserFavorites(user.id),
        userDashboardService.getDashboardStats(user.id)
      ]);

      clearTimeout(dataTimeout);

      setProjects(projectsData);
      setFavoriteProducts(favoritesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching user data, showing empty state:', error);
      loadEmptyState();
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border border-[#20B2AA]/40 bg-[#E6FAF7] text-[#0A3A3B]";
      case "in_progress":
        return "border border-[#38BDF8]/40 bg-[#E0F2FF] text-[#0B3A4D]";
      case "draft":
        return "border border-[#E5E7EB] bg-[#F7F8FB] text-[#4B5563]";
      default:
        return "border border-[#E5E7EB] bg-[#F1F5F9] text-[#475569]";
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
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="shadow-soft bg-gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Projets totaux</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <Home className="h-6 w-6 text-[#0f766e]" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <Heart className="h-6 w-6 text-[#20B2AA]" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#111f2b]/10">
                  <Eye className="h-6 w-6 text-[#0f172a]" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#20B2AA]/15">
                  <Ruler className="h-6 w-6 text-[#0f766e]" />
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
                <HeroButton onClick={() => navigate('/measurements')} className="bg-gradient-warm">
                  <Plus className="w-4 h-4" />
                  Create New Room
                </HeroButton>
                <HeroButton
                  variant="outline"
                  onClick={() => navigate('/room-redesign')}
                  className="border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white"
                >
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
                  <HeroButton onClick={handleCreateProject}>
                    <Plus className="w-4 h-4" />
                    Créer mon premier projet
                  </HeroButton>
                </div>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0 group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
                        {project.thumbnail_url ? (
                          <img 
                            src={project.thumbnail_url} 
                            alt={project.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Home className="w-12 h-12 text-muted-foreground" />
                        )}
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
                        <HeroButton 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </HeroButton>
                        <HeroButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (project.thumbnail_url) {
                              // Download project image
                              const link = document.createElement('a');
                              link.href = project.thumbnail_url;
                              link.download = `${project.name}.jpg`;
                              link.click();
                            }
                          }}
                          disabled={!project.thumbnail_url}
                        >
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
                  <HeroButton onClick={() => navigate('/catalog')}>
                    Découvrir les produits
                  </HeroButton>
                </div>
              ) : (
                favoriteProducts.map((favorite) => (
                  <Card key={favorite.id} className="shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-40 bg-muted/50 flex items-center justify-center">
                        {favorite.item_image ? (
                          <img 
                            src={favorite.item_image} 
                            alt={favorite.item_name || 'Favorite item'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Heart className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <HeroButton 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-3 top-3 h-8 w-8 bg-[#050505]/80 p-0 hover:bg-[#050505]"
                        onClick={() => handleRemoveFromFavorites(favorite.favoritable_id, favorite.favoritable_type)}
                      >
                        <Heart className="h-4 w-4 fill-[#20B2AA] text-[#20B2AA]" />
                      </HeroButton>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        {favorite.item_name || 'Élément favori'}
                      </CardTitle>
                      <CardDescription>
                        Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          {favorite.favoritable_type === 'project' ? 'Projet' : 'Élément'}
                        </span>
                        <HeroButton size="sm" onClick={() => navigate(`/${favorite.favoritable_type}/${favorite.favoritable_id}`)}>
                          Voir l'élément
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