import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-emerald-400">Adariz</h3>
            <p className="text-slate-300">
              Transformez vos espaces avec l'intelligence artificielle. 
              Design d'intérieur révolutionnaire et personnalisé.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/style-quiz" className="hover:text-emerald-400 transition-colors">Quiz de Style</Link></li>
              <li><Link to="/measurements" className="hover:text-emerald-400 transition-colors">Mesures</Link></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Design IA</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Consultation</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">À Propos</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Notre Histoire</Link></li>
              <li><Link to="/team" className="hover:text-emerald-400 transition-colors">Notre Équipe</Link></li>
              <li><Link to="/mission" className="hover:text-emerald-400 transition-colors">Notre Mission</Link></li>
              <li><Link to="/careers" className="hover:text-emerald-400 transition-colors">Carrières</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-slate-300">
              <p>📧 contact@adariz.com</p>
              <p>📞 +33 1 23 45 67 89</p>
              <p>📍 Paris, France</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Adariz. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
