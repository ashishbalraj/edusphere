import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseStore } from '@/stores/courseStore';
import { useAuth } from '@/hooks/useAuth';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  BrainCircuit,
  Sparkles,
  Send,
  MessageSquare,
  Trophy,
  Bot,
  RefreshCcw,
  BookMarked,
  GraduationCap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, enrollments, fetchCourses, fetchMyEnrollments, updateProgress } = useCourseStore();

  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [_showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  
  // AI Tutor panel state
  const [showAITutor, setShowAITutor] = useState<boolean>(false);
  const [aiChatInput, setAiChatInput] = useState<string>('');
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const course = courses.find((c) => c.id === id);
  const enrollment = enrollments.find((e) => e.course_id === id);

  // Initialize data
  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
    if (enrollments.length === 0) {
      fetchMyEnrollments();
    }
  }, [id]);

  // Set default chat message when Tutor panel opens or active lesson changes
  useEffect(() => {
    if (course && course.materials && course.materials[activeLessonIndex]) {
      const activeLesson = course.materials[activeLessonIndex];
      setAiChatMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hi there! I am your AI study assistant for **"${course.title}"**. I am ready to help you with the active lesson: **"${activeLesson.title}"**. 

Ask me to summarize, clarify any definitions, or explain specific details. Let's learn together!`,
        },
      ]);
    }
  }, [activeLessonIndex, course]);

  // Autoscroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiChatMessages, isAiTyping]);

  if (!course) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading interactive environment...</p>
      </div>
    );
  }

  // Ensure materials exist
  const materials = course.materials || [];
  const activeMaterial = materials[activeLessonIndex];

  // If user is not enrolled, they shouldn't be here
  if (!enrollment) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <GlassCard className="p-8 border-red-500/20">
          <GraduationCap className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display">Not Enrolled Yet</h2>
          <p className="text-muted-foreground mt-2">
            You must be enrolled in this course to access the Interactive Learning Environment.
          </p>
          <Button className="mt-6 w-full" onClick={() => navigate(`/dashboard/courses/${id}`)}>
            View Course Details
          </Button>
        </GlassCard>
      </div>
    );
  }

  // Mock quiz questions generated dynamically based on the course
  const getCourseQuiz = (): QuizQuestion[] => {
    if (course.title.includes("Machine Learning")) {
      return [
        {
          question: "Which learning paradigm relies on training an agent to maximize a cumulative reward through trial and error?",
          options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Deep Learning"],
          correctAnswer: 2,
          explanation: "Reinforcement Learning is about training agents to make decisions by rewarding desired behaviors and punishing undesired ones."
        },
        {
          question: "Why can Mean Squared Error (MSE) NOT be used directly as a cost function for Logistic Regression?",
          options: ["It results in a non-convex cost function with multiple local minima", "It is mathematically impossible to calculate", "It makes the model run too slow", "It only works for three or more classes"],
          correctAnswer: 0,
          explanation: "MSE for logistic regression results in a non-convex optimization landscape, meaning gradient descent could get stuck in local minima instead of finding the global minimum."
        },
        {
          question: "What is the primary activation function used in the hidden layers of modern Neural Networks?",
          options: ["Sigmoid", "ReLU (Rectified Linear Unit)", "Softmax", "Binary Step"],
          correctAnswer: 1,
          explanation: "ReLU is highly popular because it resolves the vanishing gradient problem and allows models to train much faster."
        }
      ];
    } else if (course.title.includes("System Design")) {
      return [
        {
          question: "Which caching strategy writes data to both the cache and the primary database simultaneously?",
          options: ["Cache-Aside", "Write-Through", "Write-Behind / Write-Back", "Read-Through"],
          correctAnswer: 1,
          explanation: "Write-Through updates both the cache and database in real-time, ensuring consistency at the cost of write latency."
        },
        {
          question: "What problem does Consistent Hashing solve when scaling a distributed database?",
          options: ["It prevents database queries from crashing", "It minimizes cache misses and key re-distribution when node counts change", "It increases read throughput automatically", "It encrypts key data using public key algorithms"],
          correctAnswer: 1,
          explanation: "Consistent hashing mapping ensures that when database nodes scale up or down, only a fraction of cached keys need to be rehashed or moved."
        }
      ];
    } else {
      return [
        {
          question: "What is the typical time complexity of the Two Pointer approach on a sorted array compared to a nested loop?",
          options: ["O(N^2) vs O(N log N)", "O(N) vs O(N^2)", "O(1) vs O(N)", "O(log N) vs O(N)"],
          correctAnswer: 1,
          explanation: "The Two Pointer approach allows you to search in linear time O(N) by keeping track of two bounds, whereas a naive search requires a nested loop of O(N^2)."
        }
      ];
    }
  };

  const quizQuestions = getCourseQuiz();

  // Progress calculations
  const totalSteps = materials.length + 1; // Lessons + Final Quiz
  // Progress: totalSteps used for sidebar rendering

  const handleLessonSelect = (index: number) => {
    setShowQuiz(false);
    setActiveLessonIndex(index);
  };

  const handleMarkAsComplete = async () => {
    // Determine new progress
    // If active material is completed, progress increments
    const nextIndex = activeLessonIndex + 1;
    const completedSteps = nextIndex; // Completed steps up to current lesson
    const nextProgressPercent = Math.min(100, Math.round((completedSteps / totalSteps) * 100));

    // Update progress on backend
    if (nextProgressPercent > enrollment.progress) {
      await updateProgress(enrollment.id, nextProgressPercent);
    }

    if (nextIndex < materials.length) {
      setActiveLessonIndex(nextIndex);
    } else {
      // Go to quiz!
      setShowQuiz(true);
    }
  };

  const handleQuizSubmit = async () => {
    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(score);

    // If passed (score >= 70% or simply finished), set progress to 100%
    if (score >= 70) {
      await updateProgress(enrollment.id, 100);
    }
  };

  // Explain with AI Tutor
  const handleExplainWithAI = () => {
    if (!activeMaterial) return;
    setShowAITutor(true);
    setIsAiTyping(true);

    const promptMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Please explain the key takeaways of the lesson: "${activeMaterial.title}". Summarize it clearly.`,
    };

    setAiChatMessages(prev => [...prev, promptMessage]);

    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Here is a structured explanation of the lesson **"${activeMaterial.title}"**:\n\n* **Summary**: This lesson introduces key concepts such as ${activeMaterial.description || 'fundamental architectures'}.\n* **Key Takeaway**: Understanding the mathematical formulations or system constraints helps build more efficient applications.\n* **Real-world analogy**: Think of it like organizing index cards in a drawer. If sorted, search is linear or binary; if unsorted, you must examine every card ($O(N)$).\n\nWhat specific part of this lesson can I expand on further?`,
      };
      setAiChatMessages(prev => [...prev, responseMessage]);
      setIsAiTyping(false);
    }, 1500);
  };

  // Practice Quiz generation
  const handleAIPracticeQuiz = () => {
    if (!activeMaterial) return;
    setShowAITutor(true);
    setIsAiTyping(true);

    const promptMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Generate a quick practice question from this lesson: "${activeMaterial.title}".`,
    };

    setAiChatMessages(prev => [...prev, promptMessage]);

    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Here is a custom practice question for **"${activeMaterial.title}"**:\n\n**Question**: What is the primary focus of this topic?\n\n* A) Storing static values\n* B) Reducing operational complexity via structured rules/designs\n* C) Increasing disk speed\n\n*Reply with the correct letter, and I'll verify it!*`,
      };
      setAiChatMessages(prev => [...prev, responseMessage]);
      setIsAiTyping(false);
    }, 1500);
  };

  // Custom AI input send
  const handleSendAiMessage = () => {
    if (!aiChatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: aiChatInput,
    };

    setAiChatMessages(prev => [...prev, userMsg]);
    setAiChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Regarding your query: "${userMsg.content}" — in the context of **${course.title}**, this relates directly to optimization of resources. By establishing these methods, we prevent issues like memory bottlenecks, slow response times, or excessive cost landscapes.\n\nLet me know if you would like a code snippet or practical system design architecture to visualize this!`,
      };
      setAiChatMessages(prev => [...prev, responseMessage]);
      setIsAiTyping(false);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-6rem)] -mt-4 -mx-4 sm:-mx-6 flex overflow-hidden bg-background">
      {/* 1. Left Sidebar: Syllabus Navigator */}
      <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col shrink-0">
        <div className="p-5 border-b border-border/50">
          <Link
            to={`/dashboard/courses/${course.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Course Detail
          </Link>
          <h2 className="font-display font-bold text-lg leading-tight text-foreground">{course.title}</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span>{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-1.5" />
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-3">
                Course Syllabus
              </h3>
              <div className="space-y-1">
                {materials.map((material, idx) => {
                  const isActive = !showQuiz && idx === activeLessonIndex;
                  const isCompleted = enrollment.progress > Math.round((idx / totalSteps) * 100);

                  return (
                    <button
                      key={material.id}
                      onClick={() => handleLessonSelect(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                          : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className="truncate flex-1">{material.title}</span>
                    </button>
                  );
                })}

                {/* Final step: Quiz */}
                <button
                  onClick={() => setShowQuiz(true)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                    showQuiz
                      ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                      : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                  }`}
                >
                  {enrollment.progress === 100 ? (
                    <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />
                  ) : (
                    <BrainCircuit className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  )}
                  <span className="truncate flex-1 font-semibold">Course Review Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* 2. Middle Panel: Core Learning Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <ScrollArea className="flex-1 p-6 sm:p-10">
          <div className="max-w-3xl mx-auto pb-16">
            {!showQuiz ? (
              activeMaterial ? (
                <article className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
                    <div>
                      <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
                        {activeMaterial.title}
                      </h1>
                      <p className="text-muted-foreground mt-2 text-sm">{activeMaterial.description}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={handleExplainWithAI}>
                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                        AI Explain
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleAIPracticeQuiz}>
                        <BrainCircuit className="w-4 h-4 mr-2 text-primary" />
                        Practice Quiz
                      </Button>
                    </div>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold prose-pre:bg-secondary/40 prose-pre:border prose-pre:border-border/50">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeMaterial.content || ''}</ReactMarkdown>
                  </div>

                  <div className="flex justify-between items-center border-t border-border/50 pt-8 mt-12">
                    <Button
                      variant="ghost"
                      onClick={() => activeLessonIndex > 0 && handleLessonSelect(activeLessonIndex - 1)}
                      disabled={activeLessonIndex === 0}
                    >
                      Previous Lesson
                    </Button>
                    <Button variant="gradient" onClick={handleMarkAsComplete} className="shadow-glow">
                      {activeLessonIndex === materials.length - 1 ? 'Go to Final Quiz' : 'Mark as Complete & Next'}
                    </Button>
                  </div>
                </article>
              ) : (
                <div className="text-center py-20">
                  <BookMarked className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">No course material available</h3>
                </div>
              )
            ) : (
              // Quiz Section
              <div className="space-y-8">
                <div className="border-b border-border/50 pb-6">
                  <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                    Course Review Quiz
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Test your understanding of the course concepts. Score at least 70% to pass and complete this course.
                  </p>
                </div>

                {quizScore === null ? (
                  <div className="space-y-8">
                    {quizQuestions.map((q, qIdx) => (
                      <GlassCard key={qIdx} className="p-6 border-primary/10">
                        <h3 className="font-medium text-lg text-foreground mb-4">
                          {qIdx + 1}. {q.question}
                        </h3>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[qIdx] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                className={`w-full p-3 text-left rounded-lg text-sm border transition-all ${
                                  isSelected
                                    ? 'bg-primary/10 border-primary text-primary font-medium'
                                    : 'border-border/50 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </GlassCard>
                    ))}

                    <div className="flex justify-end pt-4">
                      <Button
                        variant="gradient"
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                        className="shadow-glow px-8"
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Quiz Results View
                  <div className="space-y-8">
                    <GlassCard className="p-8 text-center space-y-4 max-w-md mx-auto border-primary/20">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        {quizScore >= 70 ? (
                          <Trophy className="w-8 h-8 text-yellow-500" />
                        ) : (
                          <RefreshCcw className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <h2 className="text-2xl font-bold font-display text-foreground">
                        {quizScore >= 70 ? 'Congratulations!' : 'Quiz Attempt Finished'}
                      </h2>
                      <p className="text-3xl font-display font-extrabold text-primary">{quizScore}% Score</p>
                      <p className="text-sm text-muted-foreground">
                        {quizScore >= 70
                          ? 'You passed the review quiz! This course is marked as 100% complete.'
                          : 'Try reviewing the course lessons again to secure a passing score of 70%.'}
                      </p>
                      {quizScore < 70 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setQuizScore(null);
                            setSelectedAnswers({});
                            setShowExplanation({});
                          }}
                          className="w-full"
                        >
                          Retry Quiz
                        </Button>
                      )}
                      {quizScore >= 70 && (
                        <Button className="w-full" onClick={() => navigate('/dashboard/student')}>
                          Return to Dashboard
                        </Button>
                      )}
                    </GlassCard>

                    {/* Explanations list */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold font-display text-foreground">Answer Explanations</h3>
                      {quizQuestions.map((q, qIdx) => {
                        const isCorrect = selectedAnswers[qIdx] === q.correctAnswer;
                        return (
                          <GlassCard key={qIdx} className={`p-5 border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm">Question {qIdx + 1}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-3">{q.question}</p>
                            <p className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg leading-relaxed">
                              <strong>Explanation:</strong> {q.explanation}
                            </p>
                          </GlassCard>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 3. Right Sidebar: Collapsible AI Tutor */}
      <AnimatePresence>
        {showAITutor && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-border/50 bg-card/30 backdrop-blur-xl flex flex-col shrink-0"
          >
            {/* AI Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">AI Study Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAITutor(false)} className="h-8 w-8">
                &times;
              </Button>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {aiChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-7 h-7 border border-border/50 shrink-0">
                      {msg.role === 'assistant' ? (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <>
                          <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name}`} />
                          <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-glow'
                          : 'bg-secondary/50 rounded-tl-sm border border-border/50 text-foreground'
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex gap-3">
                    <Avatar className="w-7 h-7 border border-border/50 shrink-0">
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    </Avatar>
                    <div className="bg-secondary/50 rounded-xl rounded-tl-sm border border-border/50 px-4 py-3 flex gap-1 items-center">
                      <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Box */}
            <div className="p-4 border-t border-border/50 bg-background/50">
              <div className="flex gap-2">
                <Input
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendAiMessage();
                    }
                  }}
                  placeholder="Ask a question..."
                  className="bg-secondary/30 border-border/50 text-xs py-5 rounded-lg"
                />
                <Button variant="gradient" size="icon" onClick={handleSendAiMessage} className="h-9 w-9 shrink-0 shadow-glow">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Toggle (if closed) */}
      {!showAITutor && (
        <Button
          variant="gradient"
          size="icon"
          onClick={() => setShowAITutor(true)}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-glow"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
