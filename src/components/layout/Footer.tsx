import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#03070d] py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-sans text-2xl font-semibold text-[#20B2AA]">Adariz</h3>
            <p className="max-w-xs text-sm text-white/70">
              Transformez vos espaces avec l'intelligence artificielle. 
              Design d'intérieur révolutionnaire et personnalisé.
            </p>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
              <span>Design</span>
              <span className="h-px w-8 bg-white/20" />
              <span>Innovation</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-sans text-lg font-semibold text-white">Services</h4>
            <ul className="space-y-2 text-sm text-white/65">
              <li><Link to="/style-quiz" className="transition-colors hover:text-[#20B2AA]">Quiz de Style</Link></li>
              <li><Link to="/measurements" className="transition-colors hover:text-[#20B2AA]">Mesures</Link></li>
              <li><a href="#" className="transition-colors hover:text-[#20B2AA]">Design IA</a></li>
              <li><a href="#" className="transition-colors hover:text-[#20B2AA]">Consultation</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h4 className="font-sans text-lg font-semibold text-white">À Propos</h4>
            <ul className="space-y-2 text-sm text-white/65">
              <li><Link to="/about" className="transition-colors hover:text-[#20B2AA]">Notre Histoire</Link></li>
              <li><Link to="/team" className="transition-colors hover:text-[#20B2AA]">Notre Équipe</Link></li>
              <li><Link to="/mission" className="transition-colors hover:text-[#20B2AA]">Notre Mission</Link></li>
              <li><Link to="/careers" className="transition-colors hover:text-[#20B2AA]">Carrières</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-sans text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>📧 contact@adariz.com</p>
              <p>📞 +33 1 23 45 67 89</p>
              <p>📍 Paris, France</p>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center text-xs uppercase tracking-[0.4em] text-white/30">
          <p>&copy; 2025 Adariz — Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
