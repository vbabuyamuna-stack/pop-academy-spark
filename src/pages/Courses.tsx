import { CourseCard } from '@/components/CourseCard';
import { courses } from '@/data/courses';
import { BookOpen, Filter, Target, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from "@/components/Navbar";

const Courses = () => {
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Intensive'];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
     
      <div className="container py-12">
        <Navbar />
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 mb-4 border-4 border-primary shadow-lg">
            <BookOpen className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold text-white">6 Complete Programs</span>
          </div>
          <h1 className="font-display text-5xl font-bold mb-4 drop-shadow-lg">
            Right-Brain Development Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Comprehensive programs with proven techniques, expert guidance, and interactive exercises
          </p>
        </div>
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-6 w-6 text-accent" />
            <span className="text-base font-bold">Filter by level:</span>
          </div>
          {levels.map((level) => (
            <button
              key={level}
              className={`btn btn-accent btn-sm rounded-full px-6 py-2 font-bold text-white ${level === 'All' ? 'btn-active' : ''}`}
              type="button"
            >
              {level}
            </button>
          ))}
        </div>
        {/* Course Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Courses', value: '6', icon: BookOpen, color: 'bg-accent' },
            { label: 'Total Exercises', value: '30+', icon: Target, color: 'bg-primary' },
            { label: 'Video Tutorials', value: '15+', icon: Video, color: 'bg-secondary' },
            { label: 'PDF Resources', value: '20+', icon: FileText, color: 'bg-info' }
          ].map((stat, i) => (
            <div key={i} className="card bg-base-100 shadow-lg border border-primary/20 flex flex-col items-center p-6">
              <div className={`inline-flex items-center justify-center rounded-full ${stat.color} mb-2`} style={{ width: 56, height: 56 }}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div className="card bg-base-100 shadow-lg border border-primary/20">
              <CourseCard key={course.id} course={course} />
            </div>
          ))}
        </div>

        {/* Login Details Section */}
        <div className="mt-16 mb-8 p-6 rounded-2xl bg-muted/60 border-2 border-accent text-center shadow-playful">
          <h2 className="font-bold text-xl text-accent mb-2">Login Details</h2>
          <p className="text-base text-muted-foreground">To access your courses and track progress, please sign in from the login page. If you don’t have an account, use the sign-up option. Only admins can upload resources.</p>
        </div>
        {/* Learning Path */}
        <div className="mt-16 rounded-2xl p-12 bg-accent text-white shadow-lg border-4 border-primary/20">
          <h2 className="font-display text-3xl font-bold mb-4">Recommended Learning Path</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="badge badge-secondary mb-2 rounded-full px-4 py-2 text-base font-bold">Week 1-2</span>
              <h3 className="font-semibold text-xl">Foundation</h3>
              <p className="text-white/80 text-base">Start with Right Brain Development to build core visual memory skills</p>
            </div>
            <div className="space-y-2">
              <span className="badge badge-secondary mb-2 rounded-full px-4 py-2 text-base font-bold">Week 3-6</span>
              <h3 className="font-semibold text-xl">Core Skills</h3>
              <p className="text-white/80 text-base">Add Phonics, Handwriting, and Visual Math for fundamental learning</p>
            </div>
            <div className="space-y-2">
              <span className="badge badge-secondary mb-2 rounded-full px-4 py-2 text-base font-bold">Week 7+</span>
              <h3 className="font-semibold text-xl">Advanced</h3>
              <p className="text-white/80 text-base">Master Memory Training and Art & Creativity for complete development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
