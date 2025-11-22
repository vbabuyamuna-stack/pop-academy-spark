import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dpps, setDpps] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadVideoError, setUploadVideoError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
    // Delete Video
    const handleDeleteVideo = async (videoId: string, videoUrl: string) => {
      try {
        setUploadingVideo(true);
        // Remove from storage
        const filePath = videoUrl.split('/storage/v1/object/public/')[1];
        if (filePath) {
          await supabase.storage.from('videos').remove([filePath]);
        }
        // Remove from DB
        const { error } = await supabase.from('videos').delete().eq('id', videoId);
        if (error) throw error;
        toast.success('Video deleted');
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
      } catch (err: any) {
        toast.error('Delete failed: ' + err.message);
      } finally {
        setUploadingVideo(false);
      }
    };

    // Upload Video
    const handleUploadVideo = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setUploadingVideo(true);
      setUploadVideoError(null);
      const file = videoInputRef.current?.files?.[0];
      const title = (e.currentTarget.elements.namedItem('videoTitle') as HTMLInputElement)?.value;
      if (!file || !title) {
        setUploadVideoError('Please select a video and enter a title.');
        setUploadingVideo(false);
        return;
      }
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        // Upload to Supabase Storage
        const filePath = `${courseId}/${user.id}/${Date.now()}_${file.name}`;
        const { data, error: uploadError } = await supabase.storage.from('videos').upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadError) throw uploadError;
        // Get public URL
        const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath);
        const videoUrl = urlData?.publicUrl;
        // Insert into DB
        const { error: dbError, data: dbData } = await supabase.from('videos').insert({
          course_id: courseId,
          video_url: videoUrl,
          title,
          user_id: user.id,
        }).select();
        if (dbError) throw dbError;
        toast.success('Video uploaded!');
        setVideos((prev) => [...prev, dbData[0]]);
        if (videoInputRef.current) videoInputRef.current.value = '';
        (e.currentTarget.elements.namedItem('videoTitle') as HTMLInputElement).value = '';
      } catch (err: any) {
        setUploadVideoError(err.message);
        toast.error('Upload failed: ' + err.message);
      } finally {
        setUploadingVideo(false);
      }
    };
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

  // Delete PDF
  const handleDeletePDF = async (planId: string, pdfUrl: string) => {
    try {
      setUploading(true);
      // Remove from storage
      const filePath = pdfUrl.split('/storage/v1/object/public/')[1];
      if (filePath) {
        await supabase.storage.from('pdfs').remove([filePath]);
      }
      // Remove from DB
      const { error } = await supabase.from('lesson_plans').delete().eq('id', planId);
      if (error) throw error;
      toast.success('PDF deleted');
      setLessonPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err: any) {
      toast.error('Delete failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Upload PDF
  const handleUploadPDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    const file = fileInputRef.current?.files?.[0];
    const title = (e.currentTarget.elements.namedItem('title') as HTMLInputElement)?.value;
    if (!file || !title) {
      setUploadError('Please select a PDF and enter a title.');
      setUploading(false);
      return;
    }
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      // Upload to Supabase Storage
      const filePath = `${courseId}/${user.id}/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage.from('pdfs').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(filePath);
      const pdfUrl = urlData?.publicUrl;
      // Insert into DB
      const { error: dbError, data: dbData } = await supabase.from('lesson_plans').insert({
        course_id: courseId,
        pdf_url: pdfUrl,
        title,
        user_id: user.id,
      }).select();
      if (dbError) throw dbError;
      toast.success('PDF uploaded!');
      setLessonPlans((prev) => [...prev, dbData[0]]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      (e.currentTarget.elements.namedItem('title') as HTMLInputElement).value = '';
    } catch (err: any) {
      setUploadError(err.message);
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
  
      <div className="container py-12">
        <Link 
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Course Resources</h1>
          <p className="text-lg text-muted-foreground">Access lesson plans, practice problems, and video tutorials</p>
          {/* PDF Upload Form */}
          <form onSubmit={handleUploadPDF} className="mt-6 flex flex-col md:flex-row gap-4 items-center bg-muted/50 p-4 rounded-xl shadow-playful">
            <input
              type="text"
              name="title"
              placeholder="PDF Title"
              className="border rounded-full px-4 py-2 text-lg font-medium"
              required
              disabled={uploading}
            />
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="border rounded-full px-4 py-2 text-lg font-medium"
              required
              disabled={uploading}
            />
            <Button type="submit" className="rounded-full px-6 py-2 font-bold" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </Button>
            {uploadError && <span className="text-destructive font-bold ml-4">{uploadError}</span>}
          </form>

          {/* Video Upload Form */}
          <form onSubmit={handleUploadVideo} className="mt-6 flex flex-col md:flex-row gap-4 items-center bg-muted/50 p-4 rounded-xl shadow-playful">
            <input
              type="text"
              name="videoTitle"
              placeholder="Video Title"
              className="border rounded-full px-4 py-2 text-lg font-medium"
              required
              disabled={uploadingVideo}
            />
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              className="border rounded-full px-4 py-2 text-lg font-medium"
              required
              disabled={uploadingVideo}
            />
            <Button type="submit" className="rounded-full px-6 py-2 font-bold" disabled={uploadingVideo}>
              {uploadingVideo ? 'Uploading...' : 'Upload Video'}
            </Button>
            {uploadVideoError && <span className="text-destructive font-bold ml-4">{uploadVideoError}</span>}
          </form>
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
                  <div key={plan.id} className="relative">
                    <PDFViewer
                      title={plan.title}
                      url={plan.pdf_url}
                      description={plan.description}
                      type="lesson plan"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 z-10 rounded-full"
                      onClick={() => handleDeletePDF(plan.id, plan.pdf_url)}
                      disabled={uploading}
                    >
                      Delete
                    </Button>
                  </div>
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
                  <div key={video.id} className="relative">
                    <VideoPlayer
                      title={video.title}
                      url={video.video_url}
                      description={video.description}
                      thumbnail={video.thumbnail_url}
                      duration={video.duration_seconds}
                      category={video.category}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 z-10 rounded-full"
                      onClick={() => handleDeleteVideo(video.id, video.video_url)}
                      disabled={uploadingVideo}
                    >
                      Delete
                    </Button>
                  </div>
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