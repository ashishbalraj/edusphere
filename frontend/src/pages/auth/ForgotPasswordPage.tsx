import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Typically, there would be a verify OTP endpoint, but for now we'll simulate success
      // and proceed to step 3 to actually reset the password.
      // In a real flow, you'd pass the OTP and email to verify, or include it in the reset payload.
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otp.length === 6) {
        setStep(3);
      } else {
        throw new Error('Invalid OTP format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', { token: otp, new_password: newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'New Password'}
      subtitle={
        step === 1 
          ? "Enter your email address and we'll send you a recovery code." 
          : step === 2 
          ? `We sent a 6-digit code to ${email}`
          : "Create a new strong password."
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
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
                    setError(null);
                  }}
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full h-11" isLoading={loading}>
              Send Recovery Code
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit Code</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  className="pl-10 bg-background/50 font-mono text-center tracking-widest text-lg"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                    setError(null);
                  }}
                  required
                  maxLength={6}
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full h-11" isLoading={loading}>
              Verify Code
            </Button>
            
            <div className="text-center text-sm">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-muted-foreground hover:text-foreground"
              >
                Wrong email? Click here
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-background/50"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-success" />
                Must be at least 8 characters long
              </p>
            </div>

            <Button type="submit" variant="gradient" className="w-full h-11" isLoading={loading}>
              Reset Password
            </Button>
            {success && (
              <p className="text-sm text-success text-center mt-4">
                Password reset successful! Redirecting...
              </p>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
