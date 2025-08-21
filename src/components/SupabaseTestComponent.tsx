import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseConnection } from '@/lib/supabase-test';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export function SupabaseTestComponent() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: (error as Error).message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Supabase Connection Test</span>
        </CardTitle>
        <CardDescription>
          Test the connection to your Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTest} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>

        {testResult && (
          <div className={`p-4 rounded-md border ${
            testResult.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-semibold">
                {testResult.success ? 'Connection Successful!' : 'Connection Failed'}
              </span>
            </div>
            
            {testResult.success ? (
              <p className="text-sm">
                ✅ Successfully connected to Supabase!<br/>
                Your project is ready to use authentication and database features.
              </p>
            ) : (
              <div className="text-sm">
                <p className="mb-2">❌ Failed to connect to Supabase:</p>
                <code className="bg-red-100 p-2 rounded block text-xs">
                  {testResult.error}
                </code>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Project URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
          <p><strong>API Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : 'Not set'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
