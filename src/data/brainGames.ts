export interface BrainGame {
  id: string;
  title: string;
  description: string;
  type: 'interactive' | 'game';
  icon: string;
  component?: string;
  implemented: boolean;
}

export const brainGames: BrainGame[] = [
  {
    id: 'mandala-memory',
    title: 'Mandala Memory',
    description: 'Visual pattern recognition and recall training',
    type: 'interactive',
    icon: '🎯',
    implemented: false,
  },
  {
    id: 'high-speed-flashcards',
    title: 'High Speed Flashcards',
    description: 'Rapid image recognition at 0.5-second intervals',
    type: 'interactive',
    icon: '⚡',
    implemented: false,
  },
  {
    id: 'tangram-puzzle',
    title: 'Tangram Puzzle',
    description: 'Spatial reasoning and geometric visualization',
    type: 'game',
    icon: '🧩',
    implemented: false,
  },
  {
    id: 'eye-tracking',
    title: 'Eye Tracking',
    description: 'Visual coordination and tracking exercises',
    type: 'interactive',
    icon: '👁️',
    implemented: false,
  },
  {
    id: 'alpha-music',
    title: 'Alpha Music',
    description: 'Brain wave synchronization for optimal learning',
    type: 'interactive',
    icon: '🎵',
    implemented: false,
  },
  {
    id: 'speed-reaction',
    title: 'Speed Reaction',
    description: 'Enhance reflexes and decision-making speed',
    type: 'game',
    icon: '⚡',
    implemented: false,
  },
  {
    id: 'memory-training',
    title: 'Memory Training',
    description: 'Sequential and pattern-based memory exercises',
    type: 'interactive',
    icon: '🧠',
    implemented: true,
    component: 'MemoryGame',
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Focus and hand-eye coordination game',
    type: 'game',
    icon: '🐦',
    implemented: false,
  },
  {
    id: 'pattern-match',
    title: 'Pattern Match',
    description: 'Visual pattern recognition challenge',
    type: 'game',
    icon: '🎨',
    implemented: true,
    component: 'PatternMatchGame',
  },
  {
    id: 'visual-memory',
    title: 'Visual Memory',
    description: 'Image sequence memorization',
    type: 'interactive',
    icon: '📸',
    implemented: false,
  },
  {
    id: 'math-speed',
    title: 'Math Speed',
    description: 'Mental calculation under time pressure',
    type: 'game',
    icon: '🔢',
    implemented: true,
    component: 'MathSpeedGame',
  },
  {
    id: 'word-recall',
    title: 'Word Recall',
    description: 'Vocabulary and verbal memory enhancement',
    type: 'interactive',
    icon: '📝',
    implemented: false,
  },
];
