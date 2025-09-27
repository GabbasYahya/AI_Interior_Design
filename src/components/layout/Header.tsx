import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Home, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { HeroButton } from '../ui/hero-button';
import ECommerceService from '../../services/ECommerceService';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize cart count
    setCartCount(ECommerceService.getCartCount());

    // Subscribe to cart changes
    const unsubscribe = ECommerceService.onCartChange((items) => {
      const count = items.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Tableau de bord', href: '/dashboard', authRequired: true },
    { name: 'Catalogue', href: '/products' },
    { name: 'Mesures', href: '/measurements' },
    { name: 'Quiz de style', href: '/style-quiz' },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.authRequired || (item.authRequired && user)
  );

  return (
    <header className="relative z-50 border-b border-[#111827] bg-[#050505]/95 text-white backdrop-blur-md shadow-elegant">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-2">
              <div className="relative">
                <img 
                  src="/logo.jpg" 
                  alt="Adariz Logo" 
                  className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to gradient logo if image doesn't exist
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback gradient logo */}
                <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#20B2AA] to-[#0f766e] transition-transform duration-300 group-hover:scale-110">
                  <span className="text-lg font-bold text-white">A</span>
                </div>
              </div>
              <span className="font-sans text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#20B2AA]">
                Adariz
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative font-medium text-white/70 transition-colors duration-300 hover:text-[#20B2AA]"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#20B2AA] to-[#0f766e] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="relative text-white/80 hover:bg-white/10"
            >
              <ShoppingCart className="h-5 w-5 text-[#20B2AA]" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#20B2AA] p-0 text-xs text-black"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </Badge>
              )}
            </Button>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#20B2AA] border-t-transparent"></div>
                <span className="text-sm text-white/70">Chargement...</span>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-10 w-10 rounded-full transition-all duration-300 hover:ring-2 hover:ring-[#20B2AA]/40">
                    <Avatar className="h-10 w-10 border-2 border-[#1f2937] shadow-soft">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-[#20B2AA] to-[#0f766e] font-semibold text-white">
                        {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border border-[#1f2933] bg-[#040509]/95 text-white backdrop-blur-md" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium text-white">{profile.full_name}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-white/60">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-white/10">
                    <Home className="mr-2 h-4 w-4 text-[#20B2AA]" />
                    <span className="text-white">Tableau de bord</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-white/10">
                    <User className="mr-2 h-4 w-4 text-[#20B2AA]" />
                    <span className="text-white">Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/about')} className="hover:bg-white/10">
                    <Settings className="mr-2 h-4 w-4 text-[#20B2AA]" />
                    <span className="text-white">À propos</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-400">Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <HeroButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')} 
                  className="text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  Connexion
                </HeroButton>
                <HeroButton 
                  size="sm" 
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-warm px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  Créer un compte
                </HeroButton>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="p-2 text-white/70 transition-colors hover:text-[#20B2AA] md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#111827] bg-[#050505]/95 text-white backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block rounded-lg px-3 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block rounded-lg px-3 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block rounded-lg bg-gradient-warm px-3 py-2 font-medium text-white transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Créer un compte
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-[#20B2AA]" />
                  <span className="font-medium text-white">Profil</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
