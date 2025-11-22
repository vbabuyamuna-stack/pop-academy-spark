import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import { courses } from '@/data/courses';

export const VideoManager = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: 0,
    category: 'lesson'
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast.error('Error loading videos: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let videoUrl = formData.video_url;
      if (file) {
        // Upload file to Supabase Storage
        const filePath = `${formData.course_id}/${Date.now()}_${file.name}`;
        const { data, error: uploadError } = await supabase.storage.from('videos').upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath);
        videoUrl = urlData?.publicUrl;
      }
      const payload = { ...formData, video_url: videoUrl };
      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(payload)
          .eq('id', editingVideo.id);
        if (error) throw error;
        toast.success('Video updated successfully!');
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([payload]);
        if (error) throw error;
        toast.success('Video added successfully!');
      }
      resetForm();
      setFile(null);
      loadVideos();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error('Error saving video: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Video deleted successfully!');
      loadVideos();
    } catch (error: any) {
      toast.error('Error deleting video: ' + error.message);
    }
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setFormData({
      course_id: video.course_id,
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
      duration_seconds: video.duration_seconds || 0,
      category: video.category || 'lesson'
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVideo(null);
    setFormData({
      course_id: '',
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      duration_seconds: 0,
      category: 'lesson'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Video File (optional)</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Video URL (YouTube/Vimeo, optional)</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <Label>Thumbnail URL (optional)</Label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={formData.duration_seconds}
                    onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Add Video'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Video className="h-8 w-8 text-primary" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(video)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(video.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
              <p className="text-xs text-muted-foreground">
                Course: {courses.find(c => c.id === video.course_id)?.title || video.course_id}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No videos yet. Add your first video to get started!
        </div>
      )}
    </div>
  );
};