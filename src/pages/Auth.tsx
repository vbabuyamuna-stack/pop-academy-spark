import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import logo from '@/assets/pop-academy-logo.png';
import Navbar from '@/components/Navbar';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      toast.success('Account created! Please check your email to verify.');
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md rounded-[2rem] shadow-playful border-4 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Pop Academy" className="h-20 w-20 rounded-full border-4 border-primary shadow-playful" />
          </div>
          <CardTitle className="text-3xl font-display drop-shadow-lg">Welcome to Pop Academy</CardTitle>
          <CardDescription className="text-lg font-medium">Sign in to access your courses and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/50">
              <TabsTrigger value="signin" className="text-lg font-bold">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-lg font-bold">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="font-bold">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-6 w-6 text-primary drop-shadow-lg" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 py-3 rounded-full text-lg font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="font-bold">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-6 w-6 text-primary drop-shadow-lg" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 py-3 rounded-full text-lg font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-full py-3 text-lg font-bold shadow-playful bg-accent text-white hover:bg-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="font-bold">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-6 w-6 text-primary drop-shadow-lg" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 py-3 rounded-full text-lg font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-bold">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-6 w-6 text-primary drop-shadow-lg" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 py-3 rounded-full text-lg font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-bold">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-6 w-6 text-primary drop-shadow-lg" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 py-3 rounded-full text-lg font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-bold">
                    Must be at least 6 characters
                  </p>
                </div>

                <Button type="submit" className="w-full rounded-full py-3 text-lg font-bold shadow-playful bg-accent text-white hover:bg-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default Auth;