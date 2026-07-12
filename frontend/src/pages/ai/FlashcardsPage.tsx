import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Check,
  X,
  Brain,
  Loader2,
  BookOpen,
  Zap,
  Target,
  RefreshCcw
} from 'lucide-react';
import api from '@/services/api';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  status: 'new' | 'learning' | 'known';
}

const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    front: 'What is Machine Learning?',
    back: 'Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.',
    status: 'new',
  },
  {
    id: 2,
    front: 'What are the three types of Machine Learning?',
    back: '1. **Supervised Learning** — Learns from labeled data (e.g., classification, regression)\n2. **Unsupervised Learning** — Finds patterns in unlabeled data (e.g., clustering)\n3. **Reinforcement Learning** — Learns through trial and error with rewards',
    status: 'new',
  },
  {
    id: 3,
    front: 'What is a Neural Network?',
    back: 'A neural network is a computing system inspired by biological neural networks. It consists of interconnected layers of nodes (neurons) that process information using weighted connections. Deep neural networks have multiple hidden layers.',
    status: 'new',
  },
  {
    id: 4,
    front: 'Define Overfitting',
    back: 'Overfitting occurs when a model learns the training data too well, including noise and outliers, causing poor performance on unseen data. Solutions include regularization, dropout, cross-validation, and using more training data.',
    status: 'new',
  },
  {
    id: 5,
    front: 'What is Gradient Descent?',
    back: 'Gradient Descent is an optimization algorithm used to minimize the loss function by iteratively adjusting parameters in the direction of steepest descent. Variants include SGD (Stochastic), Mini-batch, and Adam optimizer.',
    status: 'new',
  },
  {
    id: 6,
    front: 'Explain Transfer Learning',
    back: 'Transfer Learning uses a pre-trained model (trained on a large dataset) as a starting point for a different but related task. This reduces training time and data requirements. Examples: using ImageNet-trained models for medical imaging.',
    status: 'new',
  },
  {
    id: 7,
    front: 'What is the Bias-Variance Tradeoff?',
    back: '**Bias** = error from overly simplistic assumptions (underfitting)\n**Variance** = error from sensitivity to training data fluctuations (overfitting)\n\nThe goal is to find the sweet spot that minimizes total error (bias² + variance).',
    status: 'new',
  },
  {
    id: 8,
    front: 'What is a Confusion Matrix?',
    back: 'A table used to evaluate classification models with four quadrants:\n- **True Positives (TP)** — Correctly predicted positive\n- **True Negatives (TN)** — Correctly predicted negative\n- **False Positives (FP)** — Type I error\n- **False Negatives (FN)** — Type II error',
    status: 'new',
  },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', icon: BookOpen, color: 'text-green-500' },
  { value: 'intermediate', label: 'Intermediate', icon: Zap, color: 'text-yellow-500' },
  { value: 'advanced', label: 'Advanced', icon: Target, color: 'text-red-500' },
];

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [direction, setDirection] = useState(0);

  const knownCount = cards.filter(c => c.status === 'known').length;
  const learningCount = cards.filter(c => c.status === 'learning').length;
  const newCount = cards.filter(c => c.status === 'new').length;
  const progress = cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0;

  const generateCards = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'flashcard',
        title: `Flashcards: ${topic}`,
        subject: topic
      });

      const prompt = `Generate 10 flashcards about "${topic}" at a ${difficulty} difficulty level.
You MUST return your ENTIRE response as a valid JSON array of objects. 
Each object must have these exact keys:
"id": (number starting from 1),
"front": "The question or concept",
"back": "The answer or definition (can contain markdown)"

Return ONLY raw JSON, no markdown blocks.`;

      const { data: responseData } = await api.post(`/ai/conversations/${newConv.id}/messages`, {
        content: prompt
      });

      let jsonStr = responseData.content;
      if (jsonStr.startsWith('`\``json')) {
        jsonStr = jsonStr.replace(/^`\``json\\n/, '').replace(/\\n`\``$/, '');
      } else if (jsonStr.startsWith('`\``')) {
        jsonStr = jsonStr.replace(/^`\``\\n/, '').replace(/\\n`\``$/, '');
      }
      
      const parsed = JSON.parse(jsonStr);
      setCards(parsed.map((c: any) => ({ ...c, status: 'new' as const })));
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error("AI Error:", err);
      // Fallback
      setCards(MOCK_FLASHCARDS.map(c => ({ ...c, status: 'new' as const })));
      setCurrentIndex(0);
      setIsFlipped(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const markCard = (status: 'learning' | 'known') => {
    setCards(prev => prev.map((c, i) => i === currentIndex ? { ...c, status } : c));
    nextCard();
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetCards = () => {
    setCards(prev => prev.map(c => ({ ...c, status: 'new' as const })));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-500">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">AI Flashcards</h1>
          <p className="text-sm text-muted-foreground">Generate smart flashcards from any topic</p>
        </div>
      </motion.div>

      {cards.length === 0 ? (
        /* Setup Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mt-12"
        >
          <GlassCard className="p-8 space-y-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-violet-500" />
              </div>
              <h2 className="text-xl font-display font-bold">Generate Flashcards</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter a topic and AI will create study cards for you</p>
            </div>

            <div className="space-y-2">
              <Label>Topic or Subject</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Machine Learning Fundamentals"
                onKeyDown={(e) => e.key === 'Enter' && generateCards()}
              />
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      difficulty === d.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <d.icon className={`w-5 h-5 ${d.color}`} />
                    <span className="text-sm font-medium">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={generateCards}
              disabled={!topic.trim() || isGenerating}
              className="w-full gap-2 h-12 text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Cards...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </GlassCard>
        </motion.div>
      ) : (
        /* Flashcard Study View */
        <div className="space-y-6">
          {/* Progress Bar */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  Known: {knownCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  Learning: {learningCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                  New: {newCount}
                </span>
              </div>
              <span className="text-sm font-medium">{progress}% Mastered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </GlassCard>

          {/* Card Area */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="rounded-full w-12 h-12"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="w-full max-w-2xl" style={{ perspective: '1200px' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front */}
                    <GlassCard
                      className="p-12 min-h-[320px] flex flex-col items-center justify-center text-center relative"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                        {currentIndex + 1} / {cards.length}
                      </div>
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                        currentCard?.status === 'known' ? 'bg-green-500/10 text-green-500' :
                        currentCard?.status === 'learning' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {currentCard?.status === 'known' ? '✓ Known' :
                         currentCard?.status === 'learning' ? '◐ Learning' : '● New'}
                      </div>
                      <Brain className="w-10 h-10 text-violet-500/30 mb-6" />
                      <h2 className="text-2xl font-display font-bold leading-relaxed">
                        {currentCard?.front}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-6 flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Click to reveal answer
                      </p>
                    </GlassCard>

                    {/* Back */}
                    <GlassCard
                      className="p-12 min-h-[320px] flex flex-col items-center justify-center absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-500">
                        Answer
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-center">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentCard?.back || ''}</ReactMarkdown>
                      </div>
                      <p className="text-sm text-muted-foreground mt-6 flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Click to see question
                      </p>
                    </GlassCard>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1}
              className="rounded-full w-12 h-12"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => markCard('learning')}
              className="gap-2 border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
            >
              <X className="w-4 h-4" />
              Still Learning
            </Button>
            <Button
              onClick={() => markCard('known')}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              Got It!
            </Button>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <Button variant="ghost" size="sm" onClick={shuffleCards} className="gap-1.5 text-muted-foreground">
              <Shuffle className="w-4 h-4" />
              Shuffle
            </Button>
            <Button variant="ghost" size="sm" onClick={resetCards} className="gap-1.5 text-muted-foreground">
              <RefreshCcw className="w-4 h-4" />
              Reset Progress
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
