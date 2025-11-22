import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, LogIn, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/pop-academy-logo.png';

export const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) checkAdminStatus(user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    setIsAdmin(!!data);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-primary/20 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="Pop Academy" 
            className="h-14 w-14 transition-transform group-hover:scale-110 group-hover:rotate-12 animate-pulse-glow" 
          />
          <span className="font-display text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Pop Academy
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary hover:scale-110",
              isActive('/') ? 'text-primary scale-110' : 'text-muted-foreground'
            )}
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link
            to="/courses"
            className={cn(
              "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary hover:scale-110",
              isActive('/courses') ? 'text-primary scale-110' : 'text-muted-foreground'
            )}
          >
            <BookOpen className="h-5 w-5" />
            <span className="hidden sm:inline">Courses</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary hover:scale-110",
                isActive('/admin') ? 'text-primary scale-110' : 'text-muted-foreground'
              )}
            >
              <Shield className="h-5 w-5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          
          {!user ? (
            <Link to="/auth">
              <Button className="gap-2 bg-gradient-primary border-0 shadow-md hover:shadow-playful transition-all hover:scale-105 font-bold">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          ) : (
            <Link to="/profile">
              <Button variant="outline" className="gap-2 border-2 border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all font-bold">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
