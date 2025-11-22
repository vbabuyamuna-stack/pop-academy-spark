import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Trophy, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface MathSpeedGameProps {
  gameId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onComplete?: (score: number, time: number) => void;
}

export const MathSpeedGame = ({ gameId, difficulty = 'medium', onComplete }: MathSpeedGameProps) => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, operator: '+' });
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const getDifficultyRange = () => {
    switch (difficulty) {
      case 'easy': return { min: 1, max: 10 };
      case 'hard': return { min: 10, max: 99 };
      default: return { min: 1, max: 50 };
    }
  };

  const generateProblem = useCallback(() => {
    const { min, max } = getDifficultyRange();
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    setProblem({ num1, num2, operator });
  }, [difficulty]);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTime(60);
    setTotalAnswered(0);
    setIsPlaying(true);
    generateProblem();
  };

  useEffect(() => {
    if (isPlaying && time > 0) {
      const timer = setTimeout(() => setTime(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0 && isPlaying) {
      setIsPlaying(false);
      toast.success(`Game Over! Final Score: ${score}`);
      onComplete?.(score, 60 - time);
    }
  }, [time, isPlaying, score, onComplete]);

  const checkAnswer = () => {
    let correct = 0;
    const { num1, num2, operator } = problem;
    
    switch (operator) {
      case '+': correct = num1 + num2; break;
      case '-': correct = num1 - num2; break;
      case '×': correct = num1 * num2; break;
    }

    const userAnswer = parseInt(answer);
    if (userAnswer === correct) {
      const points = 10 + streak * 2;
      setScore(s => s + points);
      setStreak(s => s + 1);
      toast.success(`Correct! +${points} points`, { duration: 1000 });
    } else {
      setStreak(0);
      toast.error('Incorrect!', { duration: 1000 });
    }

    setTotalAnswered(t => t + 1);
    setAnswer('');
    generateProblem();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer) {
      checkAnswer();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {!isPlaying ? (
        <Card className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Math Speed Challenge</h2>
          <p className="text-muted-foreground">
            Solve as many problems as you can in 60 seconds!
          </p>
          <Badge className="text-lg px-6 py-2 capitalize">{difficulty} Mode</Badge>
          <Button size="lg" onClick={startGame} className="gap-2">
            <Zap className="h-5 w-5" />
            Start Game
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex gap-4 justify-between flex-wrap">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Timer className="h-4 w-4 mr-2" />
              {time}s
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              Score: {score}
            </Badge>
            <Badge variant={streak >= 5 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              🔥 Streak: {streak}
            </Badge>
          </div>

          <Progress value={(time / 60) * 100} className="h-2" />

          <Card className="p-12 text-center space-y-8">
            <div className="text-6xl font-bold">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer"
                className="text-2xl text-center h-16"
                autoFocus
              />
              <Button 
                size="lg" 
                onClick={checkAnswer}
                disabled={!answer}
                className="h-16 px-8"
              >
                Submit
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Press Enter to submit • {totalAnswered} answered
            </div>
          </Card>
        </>
      )}
    </div>
  );
};