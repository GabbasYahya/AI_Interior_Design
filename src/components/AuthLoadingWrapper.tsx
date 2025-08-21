import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

interface AuthLoadingWrapperProps {
  children: React.ReactNode;
}

export const AuthLoadingWrapper = ({ children }: AuthLoadingWrapperProps) => {
  const { initialized } = useAuth();

  console.log('🔐 AuthLoadingWrapper - initialized:', initialized);

  if (!initialized) {
    console.log('⏳ Showing loading screen...');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Loading Adariz</h3>
            <p className="text-sm text-gray-600">Initializing your session...</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Auth initialized, rendering children...');
  return <>{children}</>;
};
