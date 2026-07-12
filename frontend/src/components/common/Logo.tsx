import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative">
        <div className={cn(
          'rounded-xl gradient-primary flex items-center justify-center shadow-glow',
          sizeClasses[size]
        )}>
          <GraduationCap className={cn(
            'text-white',
            size === 'sm' ? 'h-3.5 w-3.5' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
          )} />
        </div>
        <div className="absolute -inset-1 rounded-xl gradient-primary opacity-20 blur-sm -z-10" />
      </div>
      {showText && (
        <span className={cn(
          'font-display font-bold tracking-tight',
          textSizeClasses[size]
        )}>
          <span className="gradient-text">Edu</span>
          <span className="text-foreground">Sphere</span>
        </span>
      )}
    </div>
  );
}
