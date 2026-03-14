import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { UserPlus, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validare parolă
    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc');
      return;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Signup error:', err);
      
      // Mesaje de eroare în română
      const fbErr = err as { code?: string };
      if (fbErr.code === 'auth/email-already-in-use') {
        setError('Există deja un cont cu acest email');
      } else if (fbErr.code === 'auth/invalid-email') {
        setError('Email invalid');
      } else if (fbErr.code === 'auth/weak-password') {
        setError('Parola este prea slabă. Folosiți cel puțin 6 caractere');
      } else if (fbErr.code === 'auth/operation-not-allowed') {
        setError('Înregistrarea nu este activată. Contactați administratorul');
      } else {
        setError('A apărut o eroare. Vă rugăm încercați din nou');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Creare Cont Admin</CardTitle>
          <CardDescription className="text-center">
            Creați un cont nou pentru a accesa panoul de administrare
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
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minim 6 caractere
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmă Parola</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Se creează contul...
                </>
              ) : (
                'Creare Cont'
              )}
            </Button>

            <div className="text-center pt-4 border-t">
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Înapoi la autentificare
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
