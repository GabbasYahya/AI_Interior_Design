import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { HeroButton } from '../components/ui/hero-button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { signUpWithEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error: signUpError } = await signUpWithEmail(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName
        }
      );
      
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
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

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f1f5f9] via-white to-[#e6faf7] p-4">
        <Card className="w-full max-w-md border border-[#dbe4ff] shadow-soft">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6FAF7]">
              <CheckCircle className="h-6 w-6 text-[#0f766e]" />
            </div>
            <CardTitle className="text-2xl font-bold">Compte créé !</CardTitle>
            <CardDescription>
              Un email de confirmation a été envoyé à {formData.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation pour activer votre compte.
            </p>
            <HeroButton
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Aller à la connexion
            </HeroButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f1f5f9] via-white to-[#e6faf7] p-4">
      <Card className="w-full max-w-md border border-[#dbe4ff] shadow-soft">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
          <CardDescription className="text-center">
            Rejoignez Adariz et transformez vos espaces
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
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Votre nom complet"
                required
                disabled={loading}
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <HeroButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Créer mon compte
            </HeroButton>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[#0f766e] transition-colors hover:text-[#0b4c4b] hover:underline"
                >
                  Se connecter
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

export default Register;
