import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { HeroButton } from '../ui/hero-button';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Dashboard', href: '/dashboard', authRequired: true },
    { name: 'Products', href: '/products' },
    { name: 'Measurements', href: '/measurements' },
    { name: 'Style Quiz', href: '/style-quiz' },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.authRequired || (item.authRequired && user)
  );

  return (
    <header className="relative bg-white/95 backdrop-blur-sm border-b border-white/20 shadow-lg z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl text-slate-700">Adariz</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-slate-600 hover:text-emerald-600 transition-colors duration-300 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                <span className="text-sm text-slate-600">Chargement...</span>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-emerald-200 transition-all duration-300">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-xl">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-semibold">
                        {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border-white/30" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium text-slate-700">{profile.full_name}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-emerald-50">
                    <Home className="mr-2 h-4 w-4 text-emerald-600" />
                    <span className="text-slate-700">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-emerald-50">
                    <User className="mr-2 h-4 w-4 text-emerald-600" />
                    <span className="text-slate-700">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/about')} className="hover:bg-emerald-50">
                    <Settings className="mr-2 h-4 w-4 text-emerald-600" />
                    <span className="text-slate-700">About</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-600">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <HeroButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                >
                  Sign in
                </HeroButton>
                <HeroButton 
                  size="sm" 
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
                >
                  Get started
                </HeroButton>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/20">
          <div className="px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Profil</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full text-left text-red-600"
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
