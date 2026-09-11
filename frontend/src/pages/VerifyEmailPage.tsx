import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getBackendUrl } from '../lib/backend-config';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
        if (!token) {
          throw new Error('Linkul de verificare este invalid sau a expirat');
        }

        const response = await fetch(`${getBackendUrl()}/auth/verify-email`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || 'Linkul de verificare este invalid sau a expirat');
        }

        if (isMounted) {
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'A apărut o eroare. Vă rugăm încercați din nou');
        }
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-8 w-8 text-green-500" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-destructive" />}
          </div>
          <CardTitle className="text-2xl text-center">
            {status === 'loading' && 'Verificare email'}
            {status === 'success' && 'Email verificat!'}
            {status === 'error' && 'Verificare eșuată'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'success' && 'Adresa de email a fost confirmată cu succes. Vă puteți autentifica.'}
            {status === 'error' && 'Linkul de verificare este invalid sau a expirat.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'error' && error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center pt-4 border-t">
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Înapoi la autentificare
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
