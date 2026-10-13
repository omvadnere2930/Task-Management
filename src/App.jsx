import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { TaskDashboard } from './components/TaskDashboard.jsx';
import { TaskFilters } from './components/TaskFilters.jsx';
import { TaskList } from './components/TaskList.jsx';
import { TaskModal } from './components/TaskModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { DocumentationView } from './components/DocumentationView.jsx';
import { api } from './services/api.js';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

const defaultFilters = {
  search: '',
  status: 'All',
  priority: 'All',
  overdue: false,
  sortBy: 'dueDate',
  order: 'asc',
};

function TaskApp() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch tasks and statistics
  const fetchTasksAndStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        api.tasks.getAll(filters),
        api.tasks.getStats(),
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.tasks);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      showFeedback('error', err.message || 'Failed to load task board');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasksAndStats();
    } else {
      setTasks([]);
      setStats(null);
    }
  }, [isAuthenticated, fetchTasksAndStats]);

  // Seed data handler
  const handleSeedData = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setSeedingLoading(true);
    try {
      const res = await api.tasks.seed();
      if (res.success) {
        showFeedback('success', `Populated ${res.count} demonstration tasks!`);
        await fetchTasksAndStats();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Failed to seed sample data');
    } finally {
      setSeedingLoading(false);
    }
  };

  // Create / Update task
  const handleSaveTask = async (taskData) => {
    setModalLoading(true);
    try {
      if (editingTask) {
        await api.tasks.update(editingTask._id, taskData);
        showFeedback('success', 'Task updated successfully');
      } else {
        await api.tasks.create(taskData);
        showFeedback('success', 'Task created successfully');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      await fetchTasksAndStats();
    } catch (err) {
      showFeedback('error', err.message || 'Failed to save task');
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await api.tasks.delete(taskId);
      showFeedback('success', 'Task deleted successfully');
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      const statsRes = await api.tasks.getStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      showFeedback('error', err.message || 'Failed to delete task');
    }
  };

  // Quick status change
  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.tasks.update(taskId, { status: newStatus });
      const statsRes = await api.tasks.getStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      showFeedback('error', err.message || 'Failed to update task status');
      await fetchTasksAndStats();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onSeedData={handleSeedData}
        seedingLoading={seedingLoading}
      />

      {/* Toast Feedback Banner */}
      {feedback && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg border ${
              feedback.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20'
                : 'bg-rose-600 text-white border-rose-500 shadow-rose-600/20'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {authLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">
              Verifying authentication status...
            </p>
          </div>
        ) : isAuthenticated ? (
          /* Authenticated Dashboard View */
          <div className="space-y-6">
            {/* Header Greeting & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome, {user?.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage your priorities, monitor deadlines, and resolve pending tasks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDocsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Developer Hub</span>
                </button>
              </div>
            </div>

            {/* Dashboard KPIs */}
            <TaskDashboard
              stats={stats}
              onFilterOverdue={() =>
                setFilters((f) => ({ ...f, overdue: true, status: 'All' }))
              }
              onFilterStatus={(status) =>
                setFilters((f) => ({ ...f, status, overdue: false }))
              }
              onFilterPriority={(priority) =>
                setFilters((f) => ({ ...f, priority, overdue: false }))
              }
            />

            {/* Filters & Search Toolbar */}
            <TaskFilters
              filters={filters}
              onChange={setFilters}
              onAddTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              totalResults={tasks.length}
            />

            {/* Task Cards List */}
            <TaskList
              tasks={tasks}
              loading={loading}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onNewTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onSeedSample={handleSeedData}
            />
          </div>
        ) : (
          /* Unauthenticated Landing & Demo Screen */
          <div className="max-w-4xl mx-auto py-10 sm:py-16 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full-Stack MERN Architecture in JS & JSX</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Production-Grade Task Management & Deadline Control
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Complete implementation of Express REST API, MongoDB Mongoose models, bcrypt password hashing, JWT authentication, user-specific task isolation, overdue deadline calculation, and responsive React JSX frontend.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Launch App / Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 font-semibold text-sm shadow-2xs flex items-center gap-2 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span>Read Guide & Docs (Hinglish/Eng)</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  bcrypt & JWT Security
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  10-round salted password hashing, Bearer token verification, route protection middleware, and auto-logout on token expiration.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  Smart Deadline Tracking
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Instant calculation of overdue tasks, due today alerts, countdown pills, and automated KPI completion metrics.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  Mongoose & Mongo Ready
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dual-tier data storage: seamlessly connects to local MongoDB or Mongo Atlas, with high-speed fallback for testing anywhere.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Cognevance Task Management System • Pure JS & JSX Architecture</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              PowerShell Guide
            </button>
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Postman Collection
            </button>
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              API Reference
            </button>
          </div>
        </div>
      </footer>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        loading={modalLoading}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Comprehensive Docs Modal */}
      <DocumentationView
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskApp />
    </AuthProvider>
  );
}
