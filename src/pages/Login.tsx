import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { HeroButton } from '../components/ui/hero-button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signInWithEmail(formData.email, formData.password);
      
      if (signInError) {
        setError(signInError.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f1f5f9] via-white to-[#e6faf7] p-4">
      <Card className="w-full max-w-md border border-[#dbe4ff] shadow-soft">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Accédez à votre espace personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <HeroButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Se connecter
            </HeroButton>

            <div className="space-y-2 text-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#0f766e] transition-colors hover:text-[#0b4c4b] hover:underline"
              >
                Mot de passe oublié ?
              </Link>
              
              <div className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-[#0f766e] transition-colors hover:text-[#0b4c4b] hover:underline"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </form>

          <div className="mt-6 border-t border-[#e2e8f0] pt-6">
            <div className="text-center">
              <HeroButton
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full border-[#cbd5f5] text-[#1f2937] hover:bg-[#eef2ff]"
              >
                Retour à l'accueil
              </HeroButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
