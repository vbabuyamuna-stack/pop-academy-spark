import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Video, FileText, Clipboard, Gamepad2 } from 'lucide-react';
import { VideoManager } from '@/components/admin/VideoManager';
import { LessonPlanManager } from '@/components/admin/LessonPlanManager';
import { DPPManager } from '@/components/admin/DPPManager';
import { GameManager } from '@/components/admin/GameManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error('You do not have admin access');
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error: any) {
      toast.error('Error checking admin access: ' + error.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage courses, resources, videos, and games
          </p>
        </div>

        <Tabs defaultValue="videos" className="space-y-8">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4">
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2">
              <FileText className="h-4 w-4" />
              Lesson Plans
            </TabsTrigger>
            <TabsTrigger value="dpp" className="gap-2">
              <Clipboard className="h-4 w-4" />
              DPP
            </TabsTrigger>
            <TabsTrigger value="games" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <VideoManager />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonPlanManager />
          </TabsContent>

          <TabsContent value="dpp">
            <DPPManager />
          </TabsContent>

          <TabsContent value="games">
            <GameManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;