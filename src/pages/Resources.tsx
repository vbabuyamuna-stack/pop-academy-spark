import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PDFViewer } from '@/components/PDFViewer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ArrowLeft, FileText, Video, Clipboard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Resources = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [dpps, setDpps] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, [courseId]);

  const loadResources = async () => {
    try {
      setLoading(true);

      const [lessonPlansRes, dppsRes, videosRes] = await Promise.all([
        supabase.from('lesson_plans').select('*').eq('course_id', courseId),
        supabase.from('daily_practice_problems').select('*').eq('course_id', courseId),
        supabase.from('videos').select('*').eq('course_id', courseId)
      ]);

      if (lessonPlansRes.error) throw lessonPlansRes.error;
      if (dppsRes.error) throw dppsRes.error;
      if (videosRes.error) throw videosRes.error;

      setLessonPlans(lessonPlansRes.data || []);
      setDpps(dppsRes.data || []);
      setVideos(videosRes.data || []);
    } catch (error: any) {
      toast.error('Error loading resources: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container py-12">
        <Link 
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            Course Resources
          </h1>
          <p className="text-lg text-muted-foreground">
            Access lesson plans, practice problems, and video tutorials
          </p>
        </div>

        <Tabs defaultValue="lessons" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="lessons" className="gap-2">
              <FileText className="h-4 w-4" />
              Lesson Plans
            </TabsTrigger>
            <TabsTrigger value="dpp" className="gap-2">
              <Clipboard className="h-4 w-4" />
              Daily Practice
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : lessonPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessonPlans.map((plan) => (
                  <PDFViewer
                    key={plan.id}
                    title={plan.title}
                    url={plan.pdf_url}
                    description={plan.description}
                    type="lesson plan"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No lesson plans available yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="dpp" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : dpps.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dpps.map((dpp) => (
                  <PDFViewer
                    key={dpp.id}
                    title={dpp.title}
                    url={dpp.pdf_url}
                    description={`Day ${dpp.day_number} • ${dpp.difficulty}`}
                    type="practice"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No practice problems available yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : videos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoPlayer
                    key={video.id}
                    title={video.title}
                    url={video.video_url}
                    description={video.description}
                    thumbnail={video.thumbnail_url}
                    duration={video.duration_seconds}
                    category={video.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No videos available yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Resources;