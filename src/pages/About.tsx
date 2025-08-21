import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroButton } from '@/components/ui/hero-button';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Target, 
  Award,
  Heart,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: "Passion pour le Design",
      description: "Nous croyons que chaque espace mérite d'être beau et fonctionnel."
    },
    {
      icon: Lightbulb,
      title: "Innovation Continue",
      description: "L'IA au service de la créativité pour repousser les limites du possible."
    },
    {
      icon: Shield,
      title: "Accessibilité",
      description: "Démocratiser le design d'intérieur professionnel pour tous."
    },
    {
      icon: Zap,
      title: "Simplicité",
      description: "Des outils puissants dans une interface intuitive et facile à utiliser."
    }
  ];

  const team = [
    {
      name: "Équipe Frontend",
      role: "Interface Utilisateur",
      description: "Création d'expériences utilisateur exceptionnelles"
    },
    {
      name: "Équipe IA",
      role: "Intelligence Artificielle",
      description: "Développement d'algorithmes de design innovants"
    },
    {
      name: "Équipe Design",
      role: "Design d'Intérieur",
      description: "Expertise en tendances et principes de design"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            À propos d'
            <span className="bg-gradient-warm bg-clip-text text-transparent">InteriorAI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Nous révolutionnons le design d'intérieur en combinant l'intelligence artificielle 
            avec l'expertise en design pour créer des espaces exceptionnels.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Démocratiser le design d'intérieur professionnel en rendant les outils de conception 
              avancés accessibles à tous, peu importe l'expérience ou le budget.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Grâce à l'intelligence artificielle, nous transformons la façon dont les gens 
              conçoivent et vivent leurs espaces, en offrant des solutions personnalisées 
              et inspirantes.
            </p>
            <HeroButton onClick={() => navigate('/auth')}>
              Rejoignez-nous
            </HeroButton>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-soft bg-gradient-card border-0">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">10K+</h3>
                <p className="text-muted-foreground">Utilisateurs actifs</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-gradient-card border-0">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">50K+</h3>
                <p className="text-muted-foreground">Projets créés</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-gradient-card border-0">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">98%</h3>
                <p className="text-muted-foreground">Satisfaction client</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-gradient-card border-0">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">100K+</h3>
                <p className="text-muted-foreground">Designs générés</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Valeurs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Les principes qui guident notre vision et notre développement
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une équipe passionnée de designers, développeurs et experts en IA
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre espace ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà révolutionné 
            leur façon de concevoir leurs intérieurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HeroButton size="lg" onClick={() => navigate('/auth')}>
              <Sparkles className="w-5 h-5" />
              Commencer maintenant
            </HeroButton>
            <HeroButton variant="outline" size="lg" onClick={() => navigate('/style-quiz')}>
              Découvrir mon style
            </HeroButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
