import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Logo size="lg" />
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}

export function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-xs">Loading...</span>
    </div>
  );
}
