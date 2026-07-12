import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Gradients & Patterns */}
      <div className="absolute inset-0 dot-pattern opacity-40 dark:opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-soft -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-soft -z-10" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Badge variant="glass" className="px-4 py-2 text-sm border-primary/20 bg-primary/5">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="gradient-text font-medium">EduSphere AI 2.0 is now live</span>
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-tight"
        >
          The Intelligent Learning <br className="hidden md:block" />
          <span className="gradient-text">Ecosystem of the Future</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Empowering students, teachers, and institutions with AI-driven personalized tutoring, smart notes, instant quizzes, and intelligent career guidance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register">
            <Button variant="gradient" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 group">
              Start Learning for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="#features">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 glass-card border-border/50">
              Explore Features
            </Button>
          </Link>
        </motion.div>

        {/* Floating UI Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 hidden lg:flex flex-col gap-4 animate-float"
        >
          <div className="glass-card p-4 flex items-center gap-4 rounded-2xl shadow-glass">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">AI Tutor Active</p>
              <p className="text-xs text-muted-foreground">Ready to answer questions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 right-4 md:right-12 hidden lg:flex flex-col gap-4 animate-float"
          style={{ animationDelay: '2s' }}
        >
          <div className="glass-card p-4 flex items-center gap-4 rounded-2xl shadow-glass">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-success" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Study Plan Created</p>
              <p className="text-xs text-muted-foreground">Exam prep on track</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
