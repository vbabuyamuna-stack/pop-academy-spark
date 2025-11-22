import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { CourseCard } from '@/components/CourseCard';
import { courses } from '@/data/courses';
import { ArrowRight, Brain, Sparkles, Target, Users } from 'lucide-react';
import logo from '@/assets/pop-academy-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-br from-primary/90 via-secondary/90 to-accent/90">
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-background/95 backdrop-blur-sm px-6 py-2 shadow-playful animate-bounce-slow border-2 border-primary/20">
              <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
              <span className="text-sm font-bold text-primary">35-Day Intensive Programs</span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight drop-shadow-2xl bg-background/80 backdrop-blur-sm rounded-3xl py-8 px-6">
              Unlock Your Child's
              <span className="block text-primary animate-pulse mt-2">
                Right Brain Potential
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-foreground mb-8 leading-relaxed font-medium bg-background/80 backdrop-blur-sm rounded-2xl py-6 px-8 shadow-lg">
              🎨 Transform learning through proven right-brain development techniques. 
              Memory training, visual math, phonics, handwriting, and creativity courses designed for exceptional results!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="gap-2 text-lg px-8 shadow-playful hover:shadow-lg transition-all hover:scale-105 bg-gradient-primary border-0 text-primary-foreground">
                  <span className="text-2xl animate-wiggle">🚀</span>
                  Explore All Courses
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 shadow-md hover:shadow-lg transition-all hover:scale-105">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated decorative elements */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">🧠</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🎨</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-20" style={{ animationDelay: '4s' }}>📚</div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30 bg-pattern-dots">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Brain, title: 'Right-Brain Focus', desc: 'Scientifically-proven methods for enhanced learning', emoji: '🧠', color: 'from-purple-500 to-pink-500' },
              { icon: Target, title: '35-Day Programs', desc: 'Intensive courses with measurable results', emoji: '🎯', color: 'from-blue-500 to-cyan-500' },
              { icon: Users, title: 'Expert Guidance', desc: 'Comprehensive manuals and video tutorials', emoji: '👨‍🏫', color: 'from-green-500 to-teal-500' },
              { icon: Sparkles, title: '30+ Exercises', desc: 'Interactive activities and games for every course', emoji: '⭐', color: 'from-orange-500 to-yellow-500' }
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-3 animate-slide-up bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-playful hover:shadow-lg transition-all hover:scale-105" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg text-4xl animate-bounce-slow`}>
                  {feature.emoji}
                </div>
                <h3 className="font-display text-xl font-bold text-primary">{feature.title}</h3>
                <p className="text-muted-foreground font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Courses Preview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Featured Courses</h2>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
              🎓 Six comprehensive programs designed to develop your child's full cognitive potential
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/courses">
              <Button size="lg" className="gap-2 shadow-playful hover:shadow-lg transition-all hover:scale-105 text-lg bg-gradient-primary border-0">
                <span className="text-2xl">🎯</span>
                View All Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-background/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl">
              <h2 className="font-display text-5xl font-bold mb-4 text-primary">
                Ready to Transform Learning?
              </h2>
              <p className="text-xl mb-8 text-foreground font-medium">
                🚀 Join thousands of families who have unlocked their children's right-brain potential
              </p>
              <Link to="/auth">
                <Button size="lg" className="gap-2 text-lg px-8 bg-gradient-primary border-0 text-primary-foreground shadow-playful hover:shadow-lg transition-all hover:scale-105">
                  <span className="text-2xl">✨</span>
                  Start Your Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Pop Academy" className="h-8 w-8" />
              <span className="font-display font-bold text-lg">Pop Academy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Pop Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
