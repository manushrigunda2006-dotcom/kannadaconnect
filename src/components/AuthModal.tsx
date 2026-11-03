import React, { useState } from 'react';
import type { AuthMode, UserAccount } from '../types';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPasswordForEmail,
  DEMO_USER,
} from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onAuthSuccess: (user: UserAccount, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  if (!isOpen) return null;

  const configured = isSupabaseConfigured();

  const resetFormState = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCopy = (text: string, field: 'email' | 'password') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDemoLoggingIn(true);

    try {
      const result = await signInWithEmail(DEMO_USER.email, DEMO_USER.password);
      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.user) {
        onAuthSuccess(result.user, `Welcome back, ${result.user.displayName}! Preloaded evaluator profile is active.`);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate demo account.');
    } finally {
      setDemoLoggingIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.user) {
          onAuthSuccess(result.user, `Welcome back, ${result.user.displayName}!`);
          onClose();
        }
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please re-enter.');
          setLoading(false);
          return;
        }

        const result = await signUpWithEmail(email, password, displayName);
        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.user) {
          if (result.confirmationRequired) {
            setSuccessMessage(
              'Account created! A confirmation link has been sent to your email. Please verify your email before logging in.'
            );
          } else {
            onAuthSuccess(result.user, `Account created! Welcome to KannadaConnect, ${result.user.displayName}!`);
            onClose();
          }
        }
      } else if (mode === 'forgot_password') {
        const result = await resetPasswordForEmail(email);
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          setSuccessMessage(result.message || 'Check your email inbox for password reset instructions.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-8">
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 font-kannada font-bold text-lg flex items-center justify-center shadow-xs">
              ಕ
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
              KannadaConnect Account
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-2xl font-black tracking-tight font-sans">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot_password' && 'Reset Password'}
          </h2>
          <p className="text-xs text-blue-100/90 mt-1">
            {mode === 'login' && 'Log in to sync your progress, bookmarks, and streaks across devices.'}
            {mode === 'signup' && 'Join now to save your learning journey and access your pocketbook anywhere.'}
            {mode === 'forgot_password' && "We'll send you an email with instructions to reset your password."}
          </p>
        </div>

        {/* Tab Switcher (Login / Signup) */}
        {mode !== 'forgot_password' && (
          <div className="flex border-b border-slate-100 bg-slate-50/70 p-1">
            <button
              onClick={() => resetFormState('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => resetFormState('signup')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="p-6">
          {/* JUDGE DEMO ACCOUNT SECTION */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/40 to-orange-50 border-2 border-amber-300 shadow-sm relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 font-sans">
                  Judge Demo Account
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-900 border border-amber-300">
                ⚡ Instant Access
              </span>
            </div>

            <p className="text-[11px] text-slate-700 leading-snug mb-3">
              Preconfigured evaluator account with <strong>19 practiced phrases</strong>, <strong>420 XP</strong>, completed quizzes, scenarios, and sample badges.
            </p>

            {/* Demo Credentials with Copy Buttons */}
            <div className="space-y-1.5 mb-3 font-mono text-[11px]">
              {/* Email Row */}
              <div className="flex items-center justify-between bg-white/95 px-2.5 py-1.5 rounded-xl border border-amber-200/90 shadow-2xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-slate-400 font-sans text-[10px] font-bold uppercase shrink-0">Email:</span>
                  <span className="text-slate-900 font-semibold truncate select-all">{DEMO_USER.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_USER.email, 'email')}
                  className="ml-2 px-2 py-1 rounded-lg text-[10px] font-bold font-sans flex items-center gap-1 transition-all bg-amber-100 hover:bg-amber-200 text-amber-900 shrink-0 cursor-pointer"
                  title="Copy demo email"
                  aria-label="Copy demo email"
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-700" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Password Row */}
              <div className="flex items-center justify-between bg-white/95 px-2.5 py-1.5 rounded-xl border border-amber-200/90 shadow-2xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-slate-400 font-sans text-[10px] font-bold uppercase shrink-0">Pass:</span>
                  <span className="text-slate-900 font-semibold truncate select-all">{DEMO_USER.password}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_USER.password, 'password')}
                  className="ml-2 px-2 py-1 rounded-lg text-[10px] font-bold font-sans flex items-center gap-1 transition-all bg-amber-100 hover:bg-amber-200 text-amber-900 shrink-0 cursor-pointer"
                  title="Copy demo password"
                  aria-label="Copy demo password"
                >
                  {copiedField === 'password' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-700" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Login Action Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading || demoLoggingIn}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-slate-950 font-black text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {demoLoggingIn ? (
                <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Login as Demo User (1-Click Auto Fill)</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* Regular Login / Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name (Only in Sign Up) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Password (Login & Sign Up) */}
            {mode !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => resetFormState('forgot_password')}
                      className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Only in Sign Up) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || demoLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot_password' && 'Send Reset Instructions'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Optional Supabase info accordion at bottom */}
          {!configured && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-800 font-medium py-1"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Optional Cloud Sync (Supabase)</span>
                </span>
                {showSetupGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showSetupGuide && (
                <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1">
                  <p>
                    The Judge Demo Account and local registration work out of the box. For cross-browser Supabase sync, set <code className="font-mono bg-white px-1 border rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-white px-1 border rounded">VITE_SUPABASE_ANON_KEY</code>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation between modes */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col items-center gap-3 text-xs text-slate-600">
            {mode === 'forgot_password' ? (
              <button
                type="button"
                onClick={() => resetFormState('login')}
                className="text-blue-700 hover:text-blue-900 font-bold"
              >
                ← Back to Log In
              </button>
            ) : mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => resetFormState('signup')}
                  className="text-blue-700 hover:text-blue-900 font-bold underline"
                >
                  Sign Up here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => resetFormState('login')}
                  className="text-blue-700 hover:text-blue-900 font-bold underline"
                >
                  Log In
                </button>
              </p>
            )}

            {/* Guest Continuation Action */}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Continue as Guest (No account needed)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
