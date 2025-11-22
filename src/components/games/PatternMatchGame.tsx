import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Trophy, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface PatternMatchGameProps {
  gameId?: string;
  onComplete?: (score: number, time: number) => void;
}

export const PatternMatchGame = ({ gameId, onComplete }: PatternMatchGameProps) => {
  const colors = [
    { name: 'orange', class: 'bg-orange' },
    { name: 'gold', class: 'bg-gold' },
    { name: 'yellow', class: 'bg-yellow' },
    { name: 'sky', class: 'bg-sky' },
    { name: 'pink', class: 'bg-pink' },
    { name: 'blue', class: 'bg-blue' }
  ];
  const [pattern, setPattern] = useState<typeof colors[0][]>([]);
  const [userPattern, setUserPattern] = useState<typeof colors[0][]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => setTotalTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const generatePattern = (length: number) => {
    const newPattern = Array(length).fill(null).map(() => 
      colors[Math.floor(Math.random() * colors.length)]
    );
    setPattern(newPattern);
    setUserPattern([]);
    setIsShowing(true);

    setTimeout(() => {
      setIsShowing(false);
    }, 1000 + length * 500);
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setTotalTime(0);
    setIsPlaying(true);
    generatePattern(3);
  };

  const handleColorClick = (color: typeof colors[0]) => {
    if (isShowing) return;

    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === pattern.length) {
      checkPattern(newUserPattern);
    }
  };

  const checkPattern = (userAttempt: typeof colors[0][]) => {
    const correct = userAttempt.every((color, i) => color.name === pattern[i].name);

    if (correct) {
      const points = level * 100;
      setScore(s => s + points);
      toast.success(`Level ${level} complete! +${points} points`);
      setLevel(l => l + 1);
      setTimeout(() => generatePattern(3 + level), 1000);
    } else {
      setIsPlaying(false);
      toast.error(`Game Over! Final Score: ${score}`);
      onComplete?.(score, totalTime);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {!isPlaying ? (
        <Card className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Pattern Memory Game</h2>
          <p className="text-muted-foreground">
            Watch the pattern carefully and recreate it from memory!
          </p>
          <Button size="lg" onClick={startGame} className="gap-2">
            <Eye className="h-5 w-5" />
            Start Game
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex gap-4 justify-center flex-wrap">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Timer className="h-4 w-4 mr-2" />
              {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Level: {level}
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              Score: {score}
            </Badge>
          </div>

          <Card className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                {isShowing ? 'Watch the pattern!' : 'Recreate the pattern'}
              </h3>
            </div>

            {/* Pattern Display */}
            <div className="flex gap-4 justify-center min-h-24 items-center flex-wrap">
              {isShowing && pattern.map((color, i) => (
                <div
                  key={i}
                  className={`h-20 w-20 rounded-lg ${color.class} shadow-lg animate-pulse`}
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>

            {/* User Input Display */}
            {!isShowing && userPattern.length > 0 && (
              <div className="flex gap-4 justify-center flex-wrap">
                {userPattern.map((color, i) => (
                  <div
                    key={i}
                    className={`h-16 w-16 rounded-lg ${color.class} shadow-md`}
                  />
                ))}
              </div>
            )}

            {/* Color Options */}
            {!isShowing && (
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorClick(color)}
                    className={`h-20 w-full rounded-lg ${color.class} shadow-lg hover:scale-105 transition-transform`}
                  />
                ))}
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Pattern length: {pattern.length} | Your progress: {userPattern.length}/{pattern.length}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};