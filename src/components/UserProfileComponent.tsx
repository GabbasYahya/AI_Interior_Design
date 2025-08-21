import { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, Crown, Camera, Save, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UserProfileComponent() {
  const { profile, updateProfile, uploadAvatar, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        plan_type: profile.plan_type
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile(formData);
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image doit faire moins de 2MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const result = await uploadAvatar(file);
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger l'avatar",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Succès",
          description: "Avatar mis à jour avec succès",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader className="w-6 h-6 animate-spin mr-2" />
          Chargement du profil...
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">Profil non trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Mon Profil
            </CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et préférences
            </CardDescription>
          </div>
          <Badge className={getPlanBadgeColor(profile.plan_type)}>
            {profile.plan_type === 'pro' && <Crown className="w-3 h-3 mr-1" />}
            {profile.plan_type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="w-3 h-3" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isSaving}
              />
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {profile.full_name || 'Utilisateur'}
            </h3>
            <p className="text-muted-foreground flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.credits} crédits restants
            </p>
          </div>
        </div>

        <Separator />

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Informations personnelles</h4>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      full_name: profile.full_name || '',
                      phone: profile.phone || '',
                      plan_type: profile.plan_type
                    });
                  }}
                  disabled={isSaving}
                >
                  Annuler
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-3 h-3 mr-1 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Votre nom complet"
                />
              ) : (
                <p className="text-sm bg-muted p-2 rounded">
                  {profile.full_name || 'Non renseigné'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 1 23 45 67 89"
                />
              ) : (
                <p className="text-sm bg-muted p-2 rounded flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {profile.phone || 'Non renseigné'}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm bg-muted p-2 rounded flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
            <p className="text-xs text-muted-foreground">
              L'email ne peut pas être modifié depuis cette interface
            </p>
          </div>
        </div>

        <Separator />

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{profile.credits}</p>
            <p className="text-xs text-muted-foreground">Crédits</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Projets</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Favoris</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
