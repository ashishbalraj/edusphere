import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Mic,
  Video,
  Play,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  BarChart,
  ChevronRight,
  Loader2,
  Send
} from 'lucide-react';
import api from '@/services/api';

const INTERVIEW_MODES = [
  { id: 'behavioral', label: 'Behavioral', icon: MessageSquare, description: 'Culture fit & soft skills' },
  { id: 'technical', label: 'Technical', icon: BrainCircuit, description: 'Algorithms & system design' },
  { id: 'case', label: 'Case Study', icon: BarChart, description: 'Business & problem solving' },
];

const MOCK_QUESTIONS = [
  "Tell me about a time you had a conflict with a team member and how you resolved it.",
  "Describe your most challenging technical project and the architecture decisions you made.",
  "Where do you see yourself in 5 years?",
  "Explain a complex technical concept to a non-technical stakeholder."
];

export default function MockInterviewPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedMode, setSelectedMode] = useState('behavioral');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const startInterview = () => {
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setFeedback(null);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'mock_interview',
        title: 'Interview Session',
        subject: selectedMode
      });

      const prompt = `Evaluate the following answer to the interview question: "${MOCK_QUESTIONS[currentQuestionIndex]}".
The candidate's answer is: "${answer}"

Provide constructive feedback and return YOUR ENTIRE RESPONSE as a valid JSON object matching exactly this structure:
{
  "score": 85,
  "label": "Strong Answer",
  "metrics": [
    { "name": "Clarity & Structure", "score": 80, "status": "Good" },
    { "name": "STAR Method Usage", "score": 60, "status": "Fair" },
    { "name": "Relevance", "score": 95, "status": "Excellent" }
  ],
  "what_went_well": "You clearly explained...",
  "to_improve": "Focus more on..."
}
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
      setFeedback(parsed);
    } catch (err) {
      console.error(err);
      setFeedback({
        score: 70,
        label: "Needs Improvement",
        metrics: [{ name: "API Error", score: 0, status: "Error" }],
        what_went_well: "N/A",
        to_improve: "Failed to connect to AI for feedback."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
      setAnswer('');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-500">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Mock Interview</h1>
            <p className="text-sm text-muted-foreground">Practice interviews with AI feedback</p>
          </div>
        </div>
        {isStarted && (
          <Button variant="outline" size="sm" onClick={() => setIsStarted(false)}>
            End Session
          </Button>
        )}
      </motion.div>

      {!isStarted ? (
        /* Setup State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 mt-12"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Configure Your Session</h2>
              <p className="text-muted-foreground">Select the type of interview you want to practice. The AI will adapt its questions and evaluation criteria accordingly.</p>
            </div>

            <div className="space-y-4">
              {INTERVIEW_MODES.map(mode => (
                <div
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                    selectedMode === mode.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${selectedMode === mode.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <mode.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{mode.label}</h3>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={startInterview} className="w-full gap-2 h-12 text-base">
              <Play className="w-5 h-5" /> Start Interview
            </Button>
          </div>

          <div>
            <GlassCard className="p-6 h-full flex flex-col justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center">
                  <Video className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Camera & Mic Check</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    For the best experience, we'll simulate a video call environment. 
                    (Note: This is a demo, actual recording is disabled).
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-4">
                  <Badge variant="outline" className="gap-2 px-3 py-1 text-green-500 border-green-500/30 bg-green-500/10">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mic Ready
                  </Badge>
                  <Badge variant="outline" className="gap-2 px-3 py-1 text-green-500 border-green-500/30 bg-green-500/10">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Camera Ready
                  </Badge>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      ) : (
        /* Active Interview State */
        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Main Stage */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <GlassCard className="flex-1 flex flex-col relative overflow-hidden bg-black/5 dark:bg-black/20">
              {/* Question Banner */}
              <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-background to-transparent z-10">
                <Badge variant="secondary" className="mb-3">Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}</Badge>
                <h2 className="text-2xl font-bold font-display leading-tight">
                  "{MOCK_QUESTIONS[currentQuestionIndex]}"
                </h2>
              </div>

              {/* Simulation Area & Controls */}
              <div className="flex-1 flex flex-col p-6 mt-16 z-20">
                <div className="flex-1">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-full min-h-[200px] p-4 rounded-xl bg-background border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting || feedback !== null}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={submitAnswer} 
                    disabled={!answer.trim() || isSubmitting || feedback !== null}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Answer</>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* AI Feedback Panel */}
          <div className="flex flex-col gap-4 h-full">
            <GlassCard className="flex-1 p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-primary" /> AI Evaluation
                </h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <AnimatePresence mode="wait">
                  {feedback ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Score */}
                      <div className="text-center space-y-2">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${feedback.score >= 80 ? 'border-green-500 bg-green-500/10 text-green-500' : feedback.score >= 60 ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-red-500 bg-red-500/10 text-red-500'} text-2xl font-bold`}>
                          {feedback.score}
                        </div>
                        <p className="font-medium">{feedback.label}</p>
                      </div>

                      {/* Rubric */}
                      <div className="space-y-4">
                        {feedback.metrics?.map((metric: any, i: number) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{metric.name}</span>
                              <span className={`font-medium ${metric.score >= 80 ? 'text-green-500' : metric.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{metric.status}</span>
                            </div>
                            <Progress value={metric.score} className="h-1.5" indicatorClassName={metric.score >= 80 ? 'bg-green-500' : metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'} />
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
                          <strong className="text-green-600 block mb-1">What went well:</strong>
                          {feedback.what_went_well}
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
                          <strong className="text-yellow-600 block mb-1">To improve:</strong>
                          {feedback.to_improve}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                      <MessageSquare className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm">Submit your answer to receive instant AI feedback and scoring.</p>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
              
              {/* Next Question Button */}
              {feedback && (
                <div className="p-4 border-t border-border bg-secondary/30">
                  <Button onClick={nextQuestion} className="w-full gap-2">
                    Next Question <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
