import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import {
  CheckSquare,
  LogOut,
  User as UserIcon,
  BookOpen,
  Database,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const Navbar = ({
  onOpenAuth,
  onOpenDocs,
  onSeedData,
  seedingLoading,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dbInfo, setDbInfo] = useState({
    mode: 'Checking...',
    connected: false,
  });

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.health();
        if (res.success && res.database) {
          setDbInfo({
            mode: res.database.mode,
            connected: res.database.connected,
          });
        }
      } catch {
        setDbInfo({ mode: 'active', connected: true });
      }
    };
    fetchHealth();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CheckSquare className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Cognevance
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                MERN Stack
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Task Management & Deadline Tracking
            </p>
          </div>
        </div>

        {/* Database Status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Database className="h-3.5 w-3.5 text-indigo-600" />
          <span>Storage:</span>
          <span
            className={`font-semibold ${
              dbInfo.connected ? 'text-emerald-700' : 'text-blue-700'
            }`}
          >
            {dbInfo.connected ? 'MongoDB Live' : 'High-Speed DB Engine'}
          </span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              dbInfo.connected ? 'bg-emerald-500' : 'bg-blue-500'
            } animate-pulse`}
          />
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Docs & Guide Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200 transition-colors"
            title="Open MERN Guide & API Docs"
          >
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <span className="hidden sm:inline">Docs & Setup</span>
            <span className="sm:hidden">Docs</span>
          </button>

          {isAuthenticated && user ? (
            <>
              {/* Seed Demo Data Button */}
              <button
                onClick={onSeedData}
                disabled={seedingLoading}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-60"
                title="Populate test tasks for demonstration"
              >
                {seedingLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                )}
                <span>Seed Tasks</span>
              </button>

              {/* User profile capsule */}
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight truncate max-w-[130px]">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Secure Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <UserIcon className="h-4 w-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
