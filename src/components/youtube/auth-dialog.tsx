'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useYouTubeStore } from '@/store/youtube-store';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn, signUp } = useYouTubeStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setName(''); setEmail(''); setPassword('');
    setError(''); setShowPassword(false); setSuccess(false);
  };

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m); reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = mode === 'signin'
      ? signIn(email, password)
      : signUp(name, email, password);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
    setTimeout(() => { reset(); onOpenChange(false); }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="p-0 border-0 overflow-hidden max-w-[420px] bg-transparent shadow-2xl">
        <div className="relative flex flex-col bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden">

          {/* Top gradient band */}
          <div className="h-2 w-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-400" />

          <div className="px-8 pt-8 pb-10">
            {/* Logo + heading */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2 mb-4">
                <svg viewBox="0 0 28.57 20" className="h-8 w-auto">
                  <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                  <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                </svg>
                <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight" style={{fontFamily:'Roboto,Arial,sans-serif'}}>MyTube</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                {mode === 'signin'
                  ? 'Sign in to access your personalized feed'
                  : 'Join millions watching on MyTube'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-xl bg-gray-100 dark:bg-[#2a2a2a] p-1 mb-6">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    mode === m
                      ? 'bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="h-11 bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#3a3a3a] rounded-xl focus:border-red-400 focus:ring-red-400/20 dark:text-white placeholder:text-gray-400 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-11 bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#3a3a3a] rounded-xl focus:border-red-400 focus:ring-red-400/20 dark:text-white placeholder:text-gray-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={mode === 'signup' ? 6 : undefined}
                    className="h-11 pr-10 bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#3a3a3a] rounded-xl focus:border-red-400 focus:ring-red-400/20 dark:text-white placeholder:text-gray-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    {error.includes('sign up') && (
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-xs text-red-600 dark:text-red-400 underline mt-0.5 font-medium"
                      >
                        Create an account instead →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className={`w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${
                  success
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-md hover:shadow-lg active:scale-[0.98]'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {success ? (
                  <><Check className="w-4 h-4" /> Success!</>
                ) : isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{mode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-red-600 dark:text-red-400 font-semibold hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
