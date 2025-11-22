import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Play, ExternalLink, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface VideoPlayerProps {
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
}

export const VideoPlayer = ({ 
  title, 
  url, 
  description, 
  thumbnail, 
  duration,
  category = 'lesson' 
}: VideoPlayerProps) => {
  const [showPlayer, setShowPlayer] = useState(false);

  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Video className="h-8 w-8 text-primary" />
            <div className="flex gap-2">
              <Badge variant="secondary" className="capitalize">{category}</Badge>
              {duration && (
                <Badge variant="outline">{formatDuration(duration)}</Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {thumbnail && (
            <div className="relative mb-4 rounded-lg overflow-hidden group">
              <img 
                src={thumbnail} 
                alt={title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="gap-2 flex-1"
              onClick={() => setShowPlayer(true)}
            >
              <Play className="h-4 w-4" />
              Play Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-6xl p-0">
          <div className="aspect-video">
            <iframe
              src={getEmbedUrl(url)}
              className="w-full h-full rounded-lg"
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};