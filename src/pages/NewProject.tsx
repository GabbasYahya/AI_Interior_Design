import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroButton } from '@/components/ui/hero-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Home, Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const roomTypes = [
  'Salon',
  'Cuisine',
  'Chambre',
  'Salle de bain',
  'Bureau',
  'Salle à manger',
  'Couloir',
  'Garage',
  'Autre'
];

const stylePreferences = [
  'Moderne',
  'Scandinave',
  'Industriel',
  'Bohème',
  'Classique',
  'Minimaliste',
  'Rustique',
  'Art Déco',
  'Contemporain'
];

const NewProject = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    room_type: '',
    style_preference: '',
    budget_min: '',
    budget_max: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un projet",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.room_type || !formData.style_preference) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            description: formData.description || null,
            room_type: formData.room_type,
            style_preference: formData.style_preference,
            budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
            budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
            status: 'draft'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre projet a été créé avec succès !",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Accès Restreint</h1>
            <p className="text-muted-foreground mb-8">
              Vous devez être connecté pour créer un nouveau projet.
            </p>
            <HeroButton onClick={() => navigate('/auth')}>
              Se connecter
            </HeroButton>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <HeroButton 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </HeroButton>
          
          <h1 className="text-3xl font-bold mb-2">Nouveau Projet</h1>
          <p className="text-muted-foreground">
            Créez un nouveau projet de design d'intérieur
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Informations du projet
              </CardTitle>
              <CardDescription>
                Remplissez les détails de votre nouveau projet de design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="name">Nom du projet *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ex: Rénovation salon principal"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre vision pour ce projet..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="room_type">Type de pièce *</Label>
                      <Select onValueChange={(value) => handleInputChange('room_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une pièce" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="style_preference">Style préféré *</Label>
                      <Select onValueChange={(value) => handleInputChange('style_preference', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un style" />
                        </SelectTrigger>
                        <SelectContent>
                          {stylePreferences.map((style) => (
                            <SelectItem key={style} value={style.toLowerCase()}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget_min">Budget minimum (€)</Label>
                      <Input
                        id="budget_min"
                        type="number"
                        placeholder="1000"
                        value={formData.budget_min}
                        onChange={(e) => handleInputChange('budget_min', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget_max">Budget maximum (€)</Label>
                      <Input
                        id="budget_max"
                        type="number"
                        placeholder="5000"
                        value={formData.budget_max}
                        onChange={(e) => handleInputChange('budget_max', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <HeroButton
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Annuler
                  </HeroButton>
                  <HeroButton
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      'Créer le projet'
                    )}
                  </HeroButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewProject;
