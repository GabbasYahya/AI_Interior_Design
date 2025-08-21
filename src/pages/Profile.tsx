import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, Heart, Home, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { HeroButton } from '../components/ui/hero-button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { supabase } from '../integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  avatar_url?: string;
  bio?: string;
  preferences?: any;
  credits: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed';
  created_at: string;
  image_url?: string;
}

interface FavoriteProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
  added_at: string;
}

const Profile: React.FC = () => {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load profile
      if (authProfile) {
        setProfile({
          id: user?.id || '',
          full_name: authProfile.full_name || '',
          email: user?.email || '',
          phone: (authProfile as any).phone || '',
          address: (authProfile as any).address || '',
          city: (authProfile as any).city || '',
          postal_code: (authProfile as any).postal_code || '',
          country: (authProfile as any).country || 'France',
          avatar_url: authProfile.avatar_url || '',
          bio: (authProfile as any).bio || '',
          preferences: authProfile.preferences || {},
          credits: authProfile.credits || 0
        });
      }

      // Load projects (mock data for now)
      setProjects([
        {
          id: '1',
          name: 'Salon Moderne',
          description: 'Redesign complet du salon principal',
          status: 'in-progress',
          created_at: '2024-01-15',
          image_url: '/api/placeholder/300/200'
        },
        {
          id: '2',
          name: 'Chambre Parentale',
          description: 'Décoration chambre style scandinave',
          status: 'completed',
          created_at: '2024-01-10',
          image_url: '/api/placeholder/300/200'
        }
      ]);

      // Load favorites (mock data for now)
      setFavorites([
        {
          id: '1',
          product_id: '1',
          product_name: 'Canapé Moderne Gris',
          product_image: '/api/placeholder/200/200',
          product_price: 899,
          added_at: '2024-01-20'
        },
        {
          id: '2',
          product_id: '2',
          product_name: 'Table Basse Scandinave',
          product_image: '/api/placeholder/200/200',
          product_price: 299,
          added_at: '2024-01-18'
        }
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name || profile.full_name,
          phone: editedProfile.phone || profile.phone,
          address: editedProfile.address || profile.address,
          city: editedProfile.city || profile.city,
          postal_code: editedProfile.postal_code || profile.postal_code,
          country: editedProfile.country || profile.country,
          bio: editedProfile.bio || profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, ...editedProfile } : null);
      setIsEditing(false);
      setEditedProfile({});
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const variants = {
      'draft': 'secondary',
      'in-progress': 'default',
      'completed': 'default'
    } as const;

    const labels = {
      'draft': 'Brouillon',
      'in-progress': 'En cours',
      'completed': 'Terminé'
    };

    return (
      <Badge variant={variants[status]} className={
        status === 'completed' ? 'bg-green-100 text-green-800' :
        status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }>
        {labels[status]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-700 mb-4">Profil non trouvé</h1>
          <p className="text-slate-600">Impossible de charger les informations du profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-emerald-200">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-2xl font-bold">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{profile.full_name || 'Utilisateur'}</h1>
              <p className="text-slate-600 mb-3">{profile.email}</p>
              {profile.bio && (
                <p className="text-slate-600 mb-3">{profile.bio}</p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200">
                  <span className="text-sm font-medium text-emerald-700">{profile.credits} crédits</span>
                </div>
                <HeroButton
                  variant={isEditing ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                      setEditedProfile({});
                    } else {
                      setIsEditing(true);
                      setEditedProfile({});
                    }
                  }}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Annuler
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </>
                  )}
                </HeroButton>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Projets
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favoris
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Facturation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et préférences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      value={isEditing ? (editedProfile.full_name ?? profile.full_name) : profile.full_name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={isEditing ? (editedProfile.phone ?? profile.phone ?? '') : (profile.phone || '')}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={isEditing ? (editedProfile.address ?? profile.address ?? '') : (profile.address || '')}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={isEditing ? (editedProfile.city ?? profile.city ?? '') : (profile.city || '')}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={isEditing ? (editedProfile.postal_code ?? profile.postal_code ?? '') : (profile.postal_code || '')}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, postal_code: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <HeroButton onClick={handleSaveProfile} disabled={saving}>
                      {saving ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </HeroButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Mes Projets</CardTitle>
                <CardDescription>
                  Suivez l'avancement de vos projets de décoration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={project.image_url}
                          alt={project.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVWMTI1TTEyNSAxMDBIMTUwSDE2MjVIMTc1IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE0Ij5Qcm9qZXQ8L3RleHQ+Cjwvc3ZnPg==';
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-slate-800">{project.name}</h3>
                          {getStatusBadge(project.status)}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                        <p className="text-xs text-gray-500">
                          Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun projet pour le moment</p>
                    <p className="text-sm text-gray-400">Commencez votre premier projet de décoration</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Produits Favoris</CardTitle>
                <CardDescription>
                  Retrouvez tous vos produits préférés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id} className="overflow-hidden">
                      <div className="aspect-square bg-gray-200">
                        <img
                          src={favorite.product_image}
                          alt={favorite.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVWMTI1TTc1IDEwMEgxMDBIMTEyNUgxMjUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR4dCB4PSIxMDAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZCNzI4MCIgZm9udC1zaXplPSIxMiI+UHJvZHVpdDwvdGV4dD4KPC9zdmc+';
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-1">{favorite.product_name}</h3>
                        <p className="text-lg font-bold text-emerald-600 mb-2">{favorite.product_price}€</p>
                        <p className="text-xs text-gray-500">
                          Ajouté le {new Date(favorite.added_at).toLocaleDateString('fr-FR')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {favorites.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun produit favori</p>
                    <p className="text-sm text-gray-400">Ajoutez des produits à vos favoris depuis le catalogue</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Facturation et Crédits</CardTitle>
                <CardDescription>
                  Gérez vos crédits et informations de facturation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-800">Solde de crédits</h3>
                      <p className="text-emerald-600">Utilisez vos crédits pour des designs personnalisés</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-emerald-700">{profile.credits}</p>
                      <p className="text-sm text-emerald-600">crédits disponibles</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h4 className="font-semibold mb-2">Pack Starter</h4>
                      <p className="text-2xl font-bold text-emerald-600 mb-2">10 crédits</p>
                      <p className="text-sm text-gray-600 mb-4">29€</p>
                      <HeroButton size="sm" className="w-full">Acheter</HeroButton>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h4 className="font-semibold mb-2">Pack Pro</h4>
                      <p className="text-2xl font-bold text-emerald-600 mb-2">25 crédits</p>
                      <p className="text-sm text-gray-600 mb-4">69€</p>
                      <HeroButton size="sm" className="w-full">Acheter</HeroButton>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h4 className="font-semibold mb-2">Pack Premium</h4>
                      <p className="text-2xl font-bold text-emerald-600 mb-2">50 crédits</p>
                      <p className="text-sm text-gray-600 mb-4">129€</p>
                      <HeroButton size="sm" className="w-full">Acheter</HeroButton>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
