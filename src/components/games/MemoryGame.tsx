import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Trophy, Timer } from 'lucide-react';
import { toast } from 'sonner';

interface MemoryGameProps {
  gameId?: string;
  onComplete?: (score: number, time: number) => void;
}

interface CardItem {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame = ({ gameId, onComplete }: MemoryGameProps) => {
  const emojis = ['🎨', '🌟', '🎯', '💡', '🎪', '🎭', '🌈', '✨'];
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsPlaying(true);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (isPlaying && !gameWon) {
      const timer = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, gameWon]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      setMoves(m => m + 1);

      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, i) =>
              i === first || i === second ? { ...card, isMatched: true } : card
            )
          );
          setMatches(m => m + 1);
          setFlippedIndices([]);
          toast.success('Match found! 🎉');
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, i) =>
              i === first || i === second ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (matches === emojis.length && !gameWon) {
      setGameWon(true);
      setIsPlaying(false);
      const score = Math.max(1000 - moves * 10 - time * 2, 100);
      toast.success(`You won! Score: ${score}`);
      onComplete?.(score, time);
    }
  }, [matches, moves, time, gameWon, emojis.length, onComplete]);

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    setCards(prev =>
      prev.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedIndices([...flippedIndices, index]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Timer className="h-4 w-4 mr-2" />
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Moves: {moves}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {matches}/{emojis.length}
          </Badge>
        </div>
        <Button onClick={initializeGame} variant="outline" className="gap-2">
          <Shuffle className="h-4 w-4" />
          New Game
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`
              aspect-square flex items-center justify-center cursor-pointer
              transition-all duration-300 hover:scale-105 hover:shadow-lg
              ${card.isFlipped || card.isMatched 
                ? 'bg-gradient-to-br from-orange via-gold to-yellow shadow-colorful' 
                : 'bg-gradient-to-br from-sky via-blue to-pink/30 hover:from-pink/20'
              }
              ${card.isMatched ? 'opacity-60 scale-95' : ''}
            `}
          >
            <span className="text-4xl drop-shadow-lg">
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </span>
          </Card>
        ))}
      </div>

      {gameWon && (
        <div className="text-center space-y-4 animate-fade-in">
          <h3 className="text-2xl font-bold text-primary">🎉 Congratulations! 🎉</h3>
          <p className="text-muted-foreground">
            You completed the game in {moves} moves and {time} seconds!
          </p>
        </div>
      )}
    </div>
  );
};