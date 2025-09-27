import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SimpleHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#040b15]/85 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#06363a] to-[#20B2AA] shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Adariz</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="text-white/80 transition-colors font-medium hover:text-[#20B2AA]"
            >
              Accueil
            </button>
            <button
              onClick={() => navigate('/style-quiz')}
              className="text-white/80 transition-colors font-medium hover:text-[#20B2AA]"
            >
              Quiz de Style
            </button>
            <button
              onClick={() => navigate('/measurements')}
              className="text-white/80 transition-colors font-medium hover:text-[#20B2AA]"
            >
              Mesures
            </button>
          </nav>

          {/* CTA Button */}
          <button className="rounded-lg bg-gradient-warm px-4 py-2 font-medium text-white shadow-elegant transition-all duration-200 hover:shadow-float">
            Commencer
          </button>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
