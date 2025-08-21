import { AuthComponent } from '@/components/AuthComponent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Bienvenue sur InteriorAI</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Connectez-vous ou créez votre compte pour commencer à transformer vos espaces avec l'intelligence artificielle.
            </p>
          </div>
          
          <AuthComponent />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
