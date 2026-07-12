import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      className={cn('relative', className)}
      title={`Current: ${theme} mode`}
    >
      <Sun className={cn(
        'h-4 w-4 transition-all duration-300',
        theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
      )} />
      <Moon className={cn(
        'absolute h-4 w-4 transition-all duration-300',
        theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      )} />
      <Monitor className={cn(
        'absolute h-4 w-4 transition-all duration-300',
        theme === 'system' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
      )} />
    </Button>
  );
}
