import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, resendConfirmation } = useSupabaseAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'signup'; // 'signup' or 'confirmation'

  useEffect(() => {
    // If user is already confirmed and logged in, redirect to dashboard
    if (user && user.email_confirmed_at) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleResendConfirmation = async () => {
    if (!email) {
      setResendError('Adresse email non disponible');
      return;
    }

    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      const { error } = await resendConfirmation(email);
      if (error) throw error;
      
      setResendSuccess(true);
    } catch (error: any) {
      setResendError(error.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsResending(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'confirmation':
        return 'Email confirmé !';
      case 'signup':
      default:
        return 'Vérifiez votre email';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'confirmation':
        return 'Votre adresse email a été confirmée avec succès. Vous pouvez maintenant accéder à votre compte.';
      case 'signup':
      default:
        return 'Nous avons envoyé un lien de confirmation à votre adresse email. Cliquez sur le lien pour activer votre compte.';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'signup':
      default:
        return <Mail className="w-16 h-16 text-primary mx-auto mb-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-elegant bg-gradient-card border-0">
            <CardHeader className="text-center pb-2">
              {getIcon()}
              <CardTitle className="text-2xl mb-2">
                {getTitle()}
              </CardTitle>
              <CardDescription className="text-base">
                {getDescription()}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {email && (
                <div className="text-center">
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">{email}</span>
                    </div>
                  </div>
                </div>
              )}

              {type === 'signup' && (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      N'oubliez pas de vérifier votre dossier spam si vous ne recevez pas l'email dans les prochaines minutes.
                    </AlertDescription>
                  </Alert>

                  {resendSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Email de confirmation renvoyé avec succès !
                      </AlertDescription>
                    </Alert>
                  )}

                  {resendError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {resendError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Button
                      onClick={handleResendConfirmation}
                      disabled={isResending || !email}
                      variant="outline"
                      className="w-full"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Renvoyer l'email
                        </>
                      )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou cliquez sur "Renvoyer l'email".
                    </div>
                  </div>
                </>
              )}

              {type === 'confirmation' && (
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full"
                  >
                    Accéder au tableau de bord
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmailConfirmation;
