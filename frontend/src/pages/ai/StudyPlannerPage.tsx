import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  BookOpen,
  Brain,
  Code,
  PenTool,
  Trash2,
  Check,
  Loader2,
  X
} from 'lucide-react';
import api from '@/services/api';

interface StudyBlock {
  id: string;
  subject: string;
  topic: string;
  duration: number; // minutes
  time: string;
  color: string;
  icon: string;
  completed: boolean;
}

interface DayPlan {
  date: string;
  dayName: string;
  blocks: StudyBlock[];
}

const SUBJECT_COLORS: Record<string, string> = {
  'Machine Learning': 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-600 dark:text-violet-400',
  'Web Development': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400',
  'Data Structures': 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  'Mathematics': 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400',
  'Design Patterns': 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400',
  'Review': 'from-slate-500/20 to-gray-500/20 border-slate-500/30 text-slate-600 dark:text-slate-400',
};

const SUBJECT_ICONS: Record<string, typeof Brain> = {
  'Machine Learning': Brain,
  'Web Development': Code,
  'Data Structures': Target,
  'Mathematics': PenTool,
  'Design Patterns': BookOpen,
  'Review': Sparkles,
};

const generateWeekPlan = (): DayPlan[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const plans: { subject: string; topic: string; duration: number; time: string }[][] = [
    [ // Mon
      { subject: 'Machine Learning', topic: 'Neural Networks Basics', duration: 90, time: '09:00' },
      { subject: 'Web Development', topic: 'React Hooks Deep Dive', duration: 60, time: '14:00' },
      { subject: 'Review', topic: 'Weekly Goals Setup', duration: 30, time: '20:00' },
    ],
    [ // Tue
      { subject: 'Data Structures', topic: 'Binary Trees & BST', duration: 75, time: '09:30' },
      { subject: 'Mathematics', topic: 'Linear Algebra Basics', duration: 60, time: '14:00' },
      { subject: 'Machine Learning', topic: 'Gradient Descent Practice', duration: 45, time: '19:00' },
    ],
    [ // Wed
      { subject: 'Web Development', topic: 'TypeScript Advanced Types', duration: 90, time: '09:00' },
      { subject: 'Design Patterns', topic: 'Observer & Strategy', duration: 60, time: '14:30' },
    ],
    [ // Thu
      { subject: 'Machine Learning', topic: 'CNN Architecture', duration: 90, time: '09:00' },
      { subject: 'Data Structures', topic: 'Graph Algorithms', duration: 75, time: '14:00' },
      { subject: 'Review', topic: 'Practice Problems', duration: 45, time: '19:30' },
    ],
    [ // Fri
      { subject: 'Web Development', topic: 'Next.js SSR & SSG', duration: 75, time: '09:30' },
      { subject: 'Mathematics', topic: 'Probability & Statistics', duration: 60, time: '14:00' },
    ],
    [ // Sat
      { subject: 'Machine Learning', topic: 'Project: Image Classifier', duration: 120, time: '10:00' },
      { subject: 'Review', topic: 'Week Summary & Flashcards', duration: 45, time: '16:00' },
    ],
    [ // Sun
      { subject: 'Review', topic: 'Light Review & Rest', duration: 30, time: '11:00' },
    ],
  ];

  return days.map((dayName, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      dayName,
      blocks: (plans[i] || []).map((block) => ({
        id: crypto.randomUUID(),
        ...block,
        color: SUBJECT_COLORS[block.subject] || SUBJECT_COLORS['Review'],
        icon: block.subject,
        completed: false,
      })),
    };
  });
};

export default function StudyPlannerPage() {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [studyGoal, setStudyGoal] = useState('');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBlockSubject, setNewBlockSubject] = useState('Machine Learning');
  const [newBlockTopic, setNewBlockTopic] = useState('');
  const [newBlockDuration, setNewBlockDuration] = useState('60');
  const [newBlockTime, setNewBlockTime] = useState('09:00');

  const streak = 12; // Mock streak
  const totalMinutesThisWeek = weekPlan.reduce(
    (acc, day) => acc + day.blocks.reduce((a, b) => a + b.duration, 0), 0
  );
  const completedMinutes = weekPlan.reduce(
    (acc, day) => acc + day.blocks.filter(b => b.completed).reduce((a, b) => a + b.duration, 0), 0
  );
  const weekProgress = totalMinutesThisWeek > 0 ? Math.round((completedMinutes / totalMinutesThisWeek) * 100) : 0;

  const generatePlan = async () => {
    if (!studyGoal.trim()) return;
    setIsGenerating(true);
    
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'study_planner',
        title: 'Weekly Study Plan',
        subject: studyGoal
      });

      const prompt = `Create a 7-day study plan for this goal: "${studyGoal}".
You MUST return your ENTIRE response as a valid JSON array containing exactly 7 arrays (one for each day from Monday to Sunday). 
Each inner array should contain objects representing study blocks with exactly these keys: "subject", "topic", "duration" (in minutes, number), "time" (HH:MM string).
Example:
[
  [ { "subject": "Math", "topic": "Algebra", "duration": 60, "time": "09:00" } ],
  [ { "subject": "Science", "topic": "Biology", "duration": 45, "time": "10:00" } ],
  [], [], [], [], []
]
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
      
      const plans = JSON.parse(jsonStr);

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);

      const formattedPlan = days.map((dayName, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          dayName,
          blocks: (plans[i] || []).map((block: any) => ({
            id: crypto.randomUUID(),
            ...block,
            color: SUBJECT_COLORS[block.subject] || SUBJECT_COLORS['Review'],
            icon: block.subject,
            completed: false,
          })),
        };
      });

      setWeekPlan(formattedPlan);
    } catch (err) {
      console.error("AI Error:", err);
      // Fallback
      setWeekPlan(generateWeekPlan());
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleBlock = (dayIndex: number, blockId: string) => {
    setWeekPlan(prev => prev.map((day, i) =>
      i === dayIndex
        ? { ...day, blocks: day.blocks.map(b => b.id === blockId ? { ...b, completed: !b.completed } : b) }
        : day
    ));
  };

  const deleteBlock = (dayIndex: number, blockId: string) => {
    setWeekPlan(prev => prev.map((day, i) =>
      i === dayIndex
        ? { ...day, blocks: day.blocks.filter(b => b.id !== blockId) }
        : day
    ));
  };

  const addBlock = () => {
    if (!newBlockTopic.trim()) return;
    const newBlock: StudyBlock = {
      id: crypto.randomUUID(),
      subject: newBlockSubject,
      topic: newBlockTopic,
      duration: parseInt(newBlockDuration) || 60,
      time: newBlockTime,
      color: SUBJECT_COLORS[newBlockSubject] || SUBJECT_COLORS['Review'],
      icon: newBlockSubject,
      completed: false,
    };
    setWeekPlan(prev => prev.map((day, i) =>
      i === selectedDay
        ? { ...day, blocks: [...day.blocks, newBlock].sort((a, b) => a.time.localeCompare(b.time)) }
        : day
    ));
    setShowAddModal(false);
    setNewBlockTopic('');
  };

  const renderStudyBlock = (block: StudyBlock, dayIndex: number) => {
    const Icon = SUBJECT_ICONS[block.subject] || BookOpen;
    return (
      <motion.div
        key={block.id}
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className={`group relative flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-r transition-all ${block.color} ${
          block.completed ? 'opacity-60' : ''
        }`}
      >
        <button
          onClick={() => toggleBlock(dayIndex, block.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            block.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-current opacity-40 hover:opacity-100'
          }`}
        >
          {block.completed && <Check className="w-3.5 h-3.5" />}
        </button>

        <Icon className="w-4 h-4 shrink-0 opacity-70" />

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${block.completed ? 'line-through' : ''}`}>
            {block.topic}
          </p>
          <div className="flex items-center gap-2 text-xs opacity-70">
            <Clock className="w-3 h-3" />
            <span>{block.time}</span>
            <span>•</span>
            <span>{block.duration} min</span>
          </div>
        </div>

        <button
          onClick={() => deleteBlock(dayIndex, block.id)}
          className="opacity-0 group-hover:opacity-100 text-destructive/60 hover:text-destructive transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    );
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
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Study Planner</h1>
            <p className="text-sm text-muted-foreground">AI-powered weekly study schedule</p>
          </div>
        </div>
        {weekPlan.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-500">{streak}</span>
            <span className="text-sm text-muted-foreground">day streak</span>
          </div>
        )}
      </motion.div>

      {weekPlan.length === 0 ? (
        /* Setup */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mt-12"
        >
          <GlassCard className="p-8 space-y-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-display font-bold">Generate Study Plan</h2>
              <p className="text-sm text-muted-foreground mt-1">Tell AI your learning goals and it will create an optimized weekly schedule</p>
            </div>

            <div className="space-y-2">
              <Label>What are you studying?</Label>
              <Input
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                placeholder="e.g., Machine Learning, Web Development, Data Science"
                onKeyDown={(e) => e.key === 'Enter' && generatePlan()}
              />
            </div>

            <Button
              onClick={generatePlan}
              disabled={!studyGoal.trim() || isGenerating}
              className="w-full gap-2 h-12 text-base"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Your Plan...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate Weekly Plan</>
              )}
            </Button>
          </GlassCard>
        </motion.div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Clock className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalMinutesThisWeek / 60)}h {totalMinutesThisWeek % 60}m</p>
                <p className="text-xs text-muted-foreground">Total This Week</p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Check className="w-5 h-5 text-green-500" /></div>
              <div>
                <p className="text-2xl font-bold">{Math.round(completedMinutes / 60)}h {completedMinutes % 60}m</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 col-span-1 md:col-span-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Weekly Progress</span>
                <span className="font-bold">{weekProgress}%</span>
              </div>
              <Progress value={weekProgress} className="h-2.5" />
            </GlassCard>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex bg-secondary rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'week' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
              >Week View</button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'day' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
              >Day View</button>
            </div>
            {viewMode === 'day' && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium w-28 text-center">{weekPlan[selectedDay]?.dayName}</span>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Calendar Grid */}
          {viewMode === 'week' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weekPlan.map((day, dayIdx) => {
                const dayTotal = day.blocks.reduce((a, b) => a + b.duration, 0);
                const dayCompleted = day.blocks.filter(b => b.completed).reduce((a, b) => a + b.duration, 0);
                const isToday = new Date().toISOString().split('T')[0] === day.date;
                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIdx * 0.05 }}
                  >
                    <GlassCard className={`p-3 h-full ${isToday ? 'ring-2 ring-primary shadow-glow' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className={`text-xs font-bold uppercase ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                            {day.dayName.slice(0, 3)}
                          </p>
                          <p className="text-lg font-bold">{new Date(day.date).getDate()}</p>
                        </div>
                        {dayTotal > 0 && (
                          <Badge variant="secondary" className="text-[10px]">
                            {dayCompleted}/{dayTotal}m
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <AnimatePresence>
                          {day.blocks.map(block => renderStudyBlock(block, dayIdx))}
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={() => { setSelectedDay(dayIdx); setShowAddModal(true); }}
                        className="w-full mt-2 p-2 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-1 text-xs"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Day View */
            <GlassCard className="p-6">
              <div className="max-w-2xl mx-auto space-y-3">
                <AnimatePresence>
                  {weekPlan[selectedDay]?.blocks.map(block =>
                    renderStudyBlock(block, selectedDay)
                  )}
                </AnimatePresence>
                {weekPlan[selectedDay]?.blocks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No study sessions planned for {weekPlan[selectedDay]?.dayName}</p>
                  </div>
                )}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Study Block
                </button>
              </div>
            </GlassCard>
          )}

          {/* Add Block Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GlassCard className="p-6 w-full max-w-md space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-display font-bold">Add Study Block</h3>
                      <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <select
                        value={newBlockSubject}
                        onChange={(e) => setNewBlockSubject(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-border bg-background"
                      >
                        {Object.keys(SUBJECT_COLORS).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Input value={newBlockTopic} onChange={(e) => setNewBlockTopic(e.target.value)} placeholder="e.g., Chapter 5 Review" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" value={newBlockTime} onChange={(e) => setNewBlockTime(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (min)</Label>
                        <Input type="number" value={newBlockDuration} onChange={(e) => setNewBlockDuration(e.target.value)} />
                      </div>
                    </div>
                    <Button onClick={addBlock} className="w-full gap-2">
                      <Plus className="w-4 h-4" /> Add Block
                    </Button>
                  </GlassCard>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
