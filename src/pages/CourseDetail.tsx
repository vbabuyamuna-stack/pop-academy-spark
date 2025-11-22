import { useParams, Link } from 'react-router-dom';
import { courses } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  Video, 
  FileText,
  ExternalLink,
  Play,
  Download,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen">
        {/* <Navbar /> */}
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* <Navbar /> */}
      <div className="container py-12">
        {/* Back Button */}
        <Link to="/courses" className="inline-flex items-center gap-2 text-base text-primary font-bold hover:text-accent mb-8 transition-colors rounded-full px-4 py-2 bg-background/80 border-2 border-primary/20 shadow-playful">
          <ArrowLeft className="h-6 w-6 text-primary drop-shadow-lg" />
          Back to All Courses
        </Link>
        {/* Course Header */}
        <div className={cn("rounded-[2.5rem] p-12 mb-12 shadow-playful border-4 border-primary/20", course.color)}>
          <div className="text-white">
            <div className="flex items-start justify-between mb-6">
              <span className="inline-flex items-center justify-center rounded-full bg-background/80 shadow-lg border-4 border-primary/30" style={{ width: 80, height: 80 }}>
                <span className="text-7xl drop-shadow-lg">{course.icon}</span>
              </span>
              <Badge variant="secondary" className="rounded-full px-4 py-2 text-base font-bold">{course.level}</Badge>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              {course.title}
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-3xl font-medium">
              {course.fullDescription}
            </p>
            <div className="flex flex-wrap gap-8 text-lg font-bold">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-accent drop-shadow-lg" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-secondary drop-shadow-lg" />
                <span>{course.exercises.length} Exercises</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-6 w-6 text-primary drop-shadow-lg" />
                <span>{course.videos.length} Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-yellow drop-shadow-lg" />
                <span>{course.manuals.length + course.resources.length} Resources</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link to={`/courses/${courseId}/games`}>
                <Button className="gap-2 rounded-full px-8 py-3 font-bold">
                  <Play className="h-6 w-6" />
                  Play Games
                </Button>
              </Link>
              <Link to={`/courses/${courseId}/resources`}>
                <Button className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-8 py-3 font-bold">
                  <FileText className="h-6 w-6" />
                  View Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Learning Objectives */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4">
              {course.objectives.map((objective, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        {/* Course Content Tabs */}
        <Tabs defaultValue="exercises" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="manuals">Manuals</TabsTrigger>
          </TabsList>
          
          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.exercises.map((exercise, i) => (
                <Card key={exercise.id} className="group hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {i + 1}
                      </div>
                      <Badge variant="outline" className="capitalize">{exercise.type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{exercise.description}</p>
                    <Button className="w-full gap-2">
                      <Play className="h-4 w-4" />
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            {course.videos.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {course.videos.map((video, i) => (
                  <Card key={i} className="group hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Video className="h-8 w-8 text-primary" />
                        {video.platform && <Badge variant="secondary">{video.platform}</Badge>}
                      </div>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {video.description && (
                        <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
                      )}
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Watch Video
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Video tutorials are available in the course resources and manuals</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            {course.resources.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {course.resources.map((resource, i) => (
                  <Card key={i} className="group hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <BookOpen className="h-8 w-8 text-secondary" />
                        <Badge variant="outline" className="capitalize">{resource.type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                      )}
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Open Resource
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Additional resources are available in the manuals section</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Manuals Tab */}
          <TabsContent value="manuals" className="space-y-4">
            {course.manuals.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {course.manuals.map((manual, i) => (
                  <Card key={i} className="group hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="h-8 w-8 text-accent" />
                        {manual.platform && <Badge variant="secondary">{manual.platform}</Badge>}
                      </div>
                      <CardTitle className="text-lg">{manual.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {manual.description && (
                        <p className="text-sm text-muted-foreground mb-4">{manual.description}</p>
                      )}
                      <a href={manual.url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Download Manual
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>This course uses exercises and online resources instead of downloadable manuals</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
