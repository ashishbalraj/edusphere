import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, AlertCircle, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, fullName, role);
      // Registration succeeded and auto-logged in
      navigate(`/dashboard/${role}`);
    } catch (err) {
      // Error is handled by the auth store
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join the AI-powered learning revolution."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-2">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
              role === 'student' 
                ? "border-primary bg-primary/10 text-primary shadow-glow ring-1 ring-primary" 
                : "border-border bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <GraduationCap className="w-6 h-6" />
            <span className="font-medium text-sm">I'm a Student</span>
          </button>
          
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
              role === 'teacher' 
                ? "border-primary bg-primary/10 text-primary shadow-glow ring-1 ring-primary" 
                : "border-border bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <BookOpen className="w-6 h-6" />
            <span className="font-medium text-sm">I'm a Teacher</span>
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className="pl-10 bg-background/50"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearError();
              }}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10 bg-background/50"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 bg-background/50"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              required
              minLength={8}
            />
          </div>
          <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full h-11"
          isLoading={loading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
