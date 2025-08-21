import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SimpleHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-600">Adariz</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Accueil
            </button>
            <button
              onClick={() => navigate('/style-quiz')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Quiz de Style
            </button>
            <button
              onClick={() => navigate('/measurements')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Mesures
            </button>
          </nav>

          {/* CTA Button */}
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
            Commencer
          </button>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
