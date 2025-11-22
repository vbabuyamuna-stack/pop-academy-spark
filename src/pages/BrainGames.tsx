import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { brainGames } from '@/data/brainGames';
import { ArrowLeft, Play } from 'lucide-react';
import { MemoryGame } from '@/components/games/MemoryGame';
import { PatternMatchGame } from '@/components/games/PatternMatchGame';
import { MathSpeedGame } from '@/components/games/MathSpeedGame';
import Navbar from '@/components/Navbar';

const BrainGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    const game = brainGames.find(g => g.id === selectedGame);
    if (!game || !game.implemented) return null;

    switch (game.component) {
      case 'MemoryGame':
        return <MemoryGame />;
      case 'PatternMatchGame':
        return <PatternMatchGame />;
      case 'MathSpeedGame':
        return <MathSpeedGame />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    const game = brainGames.find(g => g.id === selectedGame);
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        {/* <Navbar /> */}
        <Navbar />
          <Button
            onClick={() => setSelectedGame(null)}
            className="mb-6 gap-2 border border-input bg-background hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{game?.icon} {game?.title}</h1>
            <p className="text-muted-foreground text-lg">{game?.description}</p>
          </div>
          <Card className="border-2">
            <CardContent className="p-8">
              {renderGame()}
            </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* <Navbar /> */}
      <Navbar />
      
      <section className="py-12 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="font-display text-5xl font-bold mb-4">
              🧠 Brain Training Games
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Enhance cognitive abilities through scientifically-designed interactive exercises
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brainGames.map((game, index) => (
              <Card 
                key={game.id}
                className="border-2 hover:shadow-lg transition-all hover:scale-105 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-5xl">{game.icon}</div>
                    <Badge 
                      variant={game.type === 'game' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {game.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{game.title}</CardTitle>
                  <CardDescription className="text-base">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {game.implemented ? (
                    <Button 
                      onClick={() => setSelectedGame(game.id)}
                      className="w-full gap-2 bg-gradient-primary"
                    >
                      <Play className="h-4 w-4" />
                      Start Exercise
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full"
                      variant="outline"
                    >
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">📁 Upload Your Own Files</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Administrators can upload custom images, audio files, and PDFs through the admin dashboard
          </p>
          <Link to="/admin">
            <Button className="gap-2 bg-gradient-primary">
              Go to Admin Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BrainGames;
