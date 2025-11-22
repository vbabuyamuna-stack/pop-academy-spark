import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Course } from '@/data/courses';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-yellow-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500',
  ];
  
  const courseIndex = course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  const gradientClass = gradients[courseIndex];

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-playful hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-primary/20 animate-scale-in">
        <div className={cn(
          "h-32 bg-gradient-to-br flex items-center justify-center relative overflow-hidden",
          gradientClass
        )}>
          <div className="absolute inset-0 bg-pattern-dots opacity-20" />
          <span className="text-7xl animate-bounce-slow relative z-10 drop-shadow-lg">
            {course.icon}
          </span>
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm shadow-md font-bold text-primary"
          >
            {course.level}
          </Badge>
        </div>
        
        <CardHeader className="pb-3">
          <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-base font-medium text-muted-foreground mt-2">
            {course.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <TrendingUp className="h-5 w-5" />
              <span>{course.exercises.length} Exercises</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="w-full gap-2 bg-gradient-primary border-0 shadow-md hover:shadow-lg transition-all group/btn font-bold">
              <span className="text-lg">🚀</span>
              Explore Course
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
