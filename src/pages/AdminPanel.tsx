import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { HeroButton } from "../components/ui/hero-button";
import { Badge } from "../components/ui/badge";
import { 
  Instagram, 
  Download, 
  RefreshCw, 
  Package, 
  CheckCircle,
  Settings,
  Users,
  BarChart3
} from "lucide-react";

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);

  const handleSyncInstagram = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Instagram sync functionality coming soon!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel d'Administration</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produits</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5" />
              Synchronisation Instagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Statut</span>
                <Badge variant="secondary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Prêt
                </Badge>
              </div>

              <HeroButton 
                onClick={handleSyncInstagram}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Synchroniser Instagram
                  </>
                )}
              </HeroButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
