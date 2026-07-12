import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  HelpCircle,
  Settings2,
  Play,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Trophy,
  ArrowRight
} from 'lucide-react';
import api from '@/services/api';

type QuizState = 'config' | 'generating' | 'active' | 'results';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const MOCK_QUIZ: Question[] = [
  {
    id: 1,
    text: "What does DOM stand for in web development?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Document Oriented Middleware",
      "Digital Output Module"
    ],
    correctIndex: 0,
    explanation: "The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content."
  },
  {
    id: 2,
    text: "Which of the following is NOT a React Hook?",
    options: [
      "useState",
      "useEffect",
      "useFetch",
      "useContext"
    ],
    correctIndex: 2,
    explanation: "useFetch is not a built-in React Hook. While developers often create custom hooks named useFetch, the built-in hooks include useState, useEffect, useContext, useReducer, etc."
  },
  {
    id: 3,
    text: "In JavaScript, what is the output of `typeof null`?",
    options: [
      '"null"',
      '"undefined"',
      '"object"',
      '"number"'
    ],
    correctIndex: 2,
    explanation: "In JavaScript, typeof null returns 'object'. This is considered a historical bug in ECMAScript, but changing it would break existing code."
  }
];

export default function QuizGeneratorPage() {
  const [quizState, setQuizState] = useState<QuizState>('config');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUIZ);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setQuizState('generating');
    
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'quiz',
        title: `Quiz: ${topic}`,
        subject: topic
      });

      const prompt = `Generate a ${numQuestions}-question multiple choice quiz about "${topic}" at a ${difficulty} difficulty level.
You MUST return your ENTIRE response as a valid JSON array of objects. 
Each object must have these exact keys:
"id": (number starting from 1),
"text": "The question text",
"options": ["option 1", "option 2", "option 3", "option 4"],
"correctIndex": (number 0-3),
"explanation": "Why this is correct"

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
      setQuestions(parsed);
      setQuizState('active');
    } catch (err) {
      console.error("AI Error:", err);
      // Fallback
      setQuestions(MOCK_QUIZ);
      setQuizState('active');
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (hasSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizState('results');
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) score++;
    });
    return Math.round((score / questions.length) * 100);
  };

  const resetQuiz = () => {
    setQuizState('config');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setHasSubmitted(false);
  };

  const renderConfig = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Settings2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display">Configure Quiz</h2>
            <p className="text-muted-foreground text-sm">Set your parameters to generate a custom assessment.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input 
              required 
              placeholder="e.g. React Hooks, JavaScript Basics, World War II" 
              className="bg-background/50" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="gradient" className="w-full shadow-glow py-6 text-lg">
              <Play className="w-5 h-5 mr-2" />
              Generate & Start Quiz
            </Button>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );

  const renderActive = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;
    const selectedAnswer = answers[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
      <motion.div
        key="active"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-3">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <Progress value={progress} className="h-2" indicatorClassName="bg-primary" />
        </div>

        <GlassCard className="p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <HelpCircle className="w-32 h-32 text-primary" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-display font-medium leading-tight mb-8 relative z-10">
            {question.text}
          </h2>

          <div className="space-y-4 relative z-10">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                  selectedAnswer === idx 
                    ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                    : 'border-border/50 bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-secondary'
                }`}
              >
                <span className="font-medium text-lg">{option}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === idx ? 'border-primary' : 'border-muted-foreground/30 group-hover:border-primary/50'
                }`}>
                  {selectedAnswer === idx && <div className="w-3 h-3 bg-primary rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <Button 
              onClick={handleNext} 
              disabled={selectedAnswer === undefined}
              className="px-8"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <motion.div
        key="results"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <GlassCard className="p-10 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${passed ? 'bg-success' : 'bg-destructive'}`} />
          
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>
              <Trophy className="w-10 h-10" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold font-display mb-2">Quiz Completed!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            You scored {score}% on this assessment.
          </p>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetQuiz}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Generate New Quiz
            </Button>
            <Button variant="default">
              Save Results
            </Button>
          </div>
        </GlassCard>

        <h2 className="text-2xl font-bold font-display">Detailed Review</h2>
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <GlassCard key={q.id} className="p-6 overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-1 h-full ${isCorrect ? 'bg-success' : 'bg-destructive'}`} />
                <div className="pl-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-lg font-medium">{idx + 1}. {q.text}</h3>
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive shrink-0" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Your Answer</p>
                      <div className={`p-3 rounded-lg border ${
                        isCorrect ? 'bg-success/10 border-success/30 text-success' : 'bg-destructive/10 border-destructive/30 text-destructive'
                      }`}>
                        {q.options[userAnswer]}
                      </div>
                    </div>
                    {!isCorrect && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Correct Answer</p>
                        <div className="p-3 rounded-lg border bg-success/10 border-success/30 text-success">
                          {q.options[q.correctIndex]}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 border border-border/50 flex gap-3">
                    <div className="mt-0.5"><HelpCircle className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="text-sm font-semibold mb-1">AI Explanation</p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-green-500" />
            </div>
            Auto Quiz
          </h1>
          <p className="text-muted-foreground mt-1">Test your knowledge with AI-generated assessments.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {quizState === 'config' && renderConfig()}
        {quizState === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-secondary rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold font-display mb-2">Crafting your questions...</h2>
            <p className="text-muted-foreground">Analyzing topic and extracting key concepts.</p>
          </motion.div>
        )}
        {quizState === 'active' && renderActive()}
        {quizState === 'results' && renderResults()}
      </AnimatePresence>
    </div>
  );
}
