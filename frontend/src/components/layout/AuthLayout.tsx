import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  imageNode?: ReactNode;
}

export function AuthLayout({ children, title, subtitle, imageNode }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Column: Form */}
      <div className="flex flex-col relative z-10">
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold tracking-tight mb-2 text-foreground">
                {title}
              </h1>
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            </div>
            
            {children}
          </motion.div>
        </div>
      </div>

      {/* Right Column: Graphic/Image */}
      <div className="hidden lg:flex relative bg-secondary/30 items-center justify-center overflow-hidden border-l">
        {/* Animated Background */}
        <div className="absolute inset-0 dot-pattern opacity-40 dark:opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        
        {/* Decorative elements */}
        <div className="relative z-10 w-full max-w-lg px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {imageNode || (
              <div className="glass-card p-12 rounded-3xl border-primary/20 shadow-glow flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse" />
                  <div className="h-4 w-32 bg-primary/20 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-border rounded" />
                  <div className="h-2 w-4/5 bg-border rounded" />
                  <div className="h-2 w-full bg-border rounded" />
                </div>
                <div className="mt-8 flex gap-4">
                  <div className="w-full h-24 rounded-xl bg-purple-500/10 animate-pulse" />
                  <div className="w-full h-24 rounded-xl bg-primary/10 animate-pulse" />
                </div>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <h3 className="text-2xl font-display font-bold mb-4">
              Join <span className="gradient-text">100,000+</span> learners
            </h3>
            <p className="text-muted-foreground text-lg">
              Unlock the power of AI to learn faster, retain more, and achieve your goals.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
