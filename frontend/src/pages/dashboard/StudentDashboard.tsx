import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCourseStore } from '@/stores/courseStore';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  FileText,
  HelpCircle,
  TrendingUp,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const tools = [
  {
    title: 'AI Tutor',
    description: 'Get instant help and explanations for any topic.',
    icon: BrainCircuit,
    href: '/ai/tutor',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Smart Notes',
    description: 'Generate concise study notes from your lectures.',
    icon: FileText,
    href: '/ai/notes',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Auto Quiz',
    description: 'Test your knowledge with AI-generated quizzes.',
    icon: HelpCircle,
    href: '/ai/quiz',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
];

const recentActivity = [
  { title: 'Data Structures & Algorithms', type: 'Quiz Completed', score: '92%', time: '2 hours ago' },
  { title: 'Machine Learning Basics', type: 'Notes Generated', time: 'Yesterday' },
  { title: 'System Design Interview', type: 'AI Tutor Session', time: '2 days ago' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { enrollments, fetchMyEnrollments, isLoading } = useCourseStore();

  useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  const activeCoursesCount = enrollments.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-8 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Student'}</span>! 👋
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mb-6">
              You're on a 5-day study streak. Keep up the great work! Your next goal is completing the Machine Learning module.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {enrollments.length > 0 ? (
                <Link to={`/dashboard/courses/${enrollments[0].course_id}/learn`}>
                  <Button variant="gradient" className="shadow-glow">
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard/courses">
                  <Button variant="gradient" className="shadow-glow">
                    Browse Courses
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 font-medium">
                <Flame className="w-4 h-4 fill-current" />
                5 Day Streak
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
 
      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
            <h3 className="text-2xl font-bold">{isLoading ? '...' : activeCoursesCount}</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Notes Generated</p>
            <h3 className="text-2xl font-bold">28</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg. Quiz Score</p>
            <h3 className="text-2xl font-bold">87%</h3>
          </div>
        </GlassCard>
      </motion.div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Tools */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Study Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.title} to={tool.href} className="block group">
                  <GlassCard className="p-5 h-full transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50 hover:-translate-y-1 shadow-sm hover:shadow-md">
                    <div className={`w-10 h-10 rounded-xl ${tool.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
 
          <div className="mt-8">
            <h2 className="text-xl font-bold font-display mb-6">Current Progress</h2>
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-sm text-muted-foreground animate-pulse">Loading progress...</div>
              ) : enrollments.length > 0 ? (
                enrollments.map((enrollment, index) => {
                  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={enrollment.id} className="space-y-2">
                      <div className="flex justify-between text-sm items-center">
                        <span className="font-medium">{enrollment.course?.title || 'Unknown Course'}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground text-xs">{Math.round(enrollment.progress)}%</span>
                          <Link to={`/dashboard/courses/${enrollment.course_id}/learn`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs px-2.5">
                              Resume
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <Progress value={enrollment.progress} className="h-2 bg-secondary" indicatorClassName={color} />
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg text-center border border-dashed">
                  You are not enrolled in any courses yet. Browse the catalog to start learning!
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold font-display mb-6">Recent Activity</h2>
            <div className="flex-1 space-y-6">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-border/50" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 z-10 border-2 border-background">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                        {activity.time}
                      </span>
                      {activity.score && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">
                          Score: {activity.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-sm text-primary hover:text-primary hover:bg-primary/5 group">
              View All Activity
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
