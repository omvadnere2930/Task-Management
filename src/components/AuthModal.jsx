import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { X, Lock, Mail, User, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, register, error, clearError } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (mode === 'register' && (!name || name.trim().length < 2)) {
      setLocalError('Full name must be at least 2 characters');
      return;
    }

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setLocalError(null);
    clearError();

    const demoEmail = 'dev.demo@cognevance.io';
    const demoPassword = 'Password123!';
    const demoName = 'Demo Developer';

    try {
      await login(demoEmail, demoPassword);
      onClose();
    } catch {
      try {
        await register(demoName, demoEmail, demoPassword);
        onClose();
      } catch (regErr) {
        setLocalError(regErr.message || 'Demo auto-login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'login'
                  ? 'Sign in to access your task board'
                  : 'Start organizing with secure JWT auth'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('login');
              clearError();
              setLocalError(null);
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mode === 'login'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              clearError();
              setLocalError(null);
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mode === 'register'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Quick Demo Access banner */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-all shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>1-Click Test Access (Pre-filled Demo Account)</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[11px] uppercase tracking-wider text-slate-400 absolute">
              or credentials
            </span>
          </div>

          {/* Error Banner */}
          {activeError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{activeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name for register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Om Vadnere"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-xs transition-all disabled:opacity-60"
            >
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Dashboard'
                : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
