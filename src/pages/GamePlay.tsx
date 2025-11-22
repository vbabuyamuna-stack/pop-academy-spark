import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemoryGame } from '@/components/games/MemoryGame';
import { MathSpeedGame } from '@/components/games/MathSpeedGame';
import { PatternMatchGame } from '@/components/games/PatternMatchGame';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GamePlay = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState('memory');

  const handleGameComplete = async (score: number, time: number, gameType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save score to database
        const { error } = await supabase.from('game_scores').insert({
          game_id: `${courseId}-${gameType}`,
          user_id: user.id,
          score,
          time_seconds: time
        });

        if (error) throw error;
        toast.success('Score saved!');
      }
    } catch (error) {
      console.error('Error saving score:', error);
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

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
            <Gamepad2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Interactive Games
          </h1>
          <p className="text-lg text-muted-foreground">
            Train your brain with these educational games
          </p>
        </div>

        <Tabs value={activeGame} onValueChange={setActiveGame} className="space-y-8">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3">
            <TabsTrigger value="memory">Memory Match</TabsTrigger>
            <TabsTrigger value="math">Math Speed</TabsTrigger>
            <TabsTrigger value="pattern">Pattern Match</TabsTrigger>
          </TabsList>

          <TabsContent value="memory">
            <MemoryGame 
              gameId={`${courseId}-memory`}
              onComplete={(score, time) => handleGameComplete(score, time, 'memory')}
            />
          </TabsContent>

          <TabsContent value="math">
            <MathSpeedGame 
              gameId={`${courseId}-math`}
              difficulty="medium"
              onComplete={(score, time) => handleGameComplete(score, time, 'math')}
            />
          </TabsContent>

          <TabsContent value="pattern">
            <PatternMatchGame 
              gameId={`${courseId}-pattern`}
              onComplete={(score, time) => handleGameComplete(score, time, 'pattern')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamePlay;