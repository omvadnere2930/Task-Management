import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Layers,
  TrendingUp,
} from 'lucide-react';

export const TaskDashboard = ({
  stats,
  onFilterOverdue,
  onFilterStatus,
  onFilterPriority,
}) => {
  if (!stats) return null;

  return (
    <div className="space-y-4">
      {/* Overdue alert banner if any overdue tasks exist */}
      {stats.overdue > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-amber-900">
                Action Required: {stats.overdue} Overdue Task{stats.overdue > 1 ? 's' : ''}!
              </h4>
              <p className="text-xs text-amber-700">
                These tasks have surpassed their deadline and require immediate attention.
              </p>
            </div>
          </div>
          <button
            onClick={onFilterOverdue}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs"
          >
            Review Overdue Tasks
          </button>
        </div>
      )}

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Tasks */}
        <button
          onClick={() => onFilterStatus('All')}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">All assigned tasks</div>
        </button>

        {/* Completed */}
        <button
          onClick={() => onFilterStatus('Completed')}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700">Completed</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{stats.completed}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">
            {stats.completionRate}% finished
          </div>
        </button>

        {/* In Progress */}
        <button
          onClick={() => onFilterStatus('In Progress')}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">In Progress</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
          <div className="text-[11px] text-blue-600/80 mt-0.5">Active execution</div>
        </button>

        {/* Pending */}
        <button
          onClick={() => onFilterStatus('Pending')}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-amber-300 hover:shadow-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">Pending</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Not started yet</div>
        </button>

        {/* Overdue */}
        <button
          onClick={onFilterOverdue}
          className={`text-left p-3.5 rounded-xl border transition-all group cursor-pointer ${
            stats.overdue > 0
              ? 'bg-rose-50/50 border-rose-300 hover:border-rose-400'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-medium ${
                stats.overdue > 0 ? 'text-rose-700 font-semibold' : 'text-slate-500'
              }`}
            >
              Overdue
            </span>
            <div
              className={`p-1.5 rounded-lg ${
                stats.overdue > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div
            className={`text-2xl font-bold ${
              stats.overdue > 0 ? 'text-rose-700' : 'text-slate-700'
            }`}
          >
            {stats.overdue}
          </div>
          <div
            className={`text-[11px] ${
              stats.overdue > 0 ? 'text-rose-600/90 font-medium' : 'text-slate-400'
            } mt-0.5`}
          >
            {stats.overdue > 0 ? 'Past deadline!' : 'On track'}
          </div>
        </button>

        {/* High Priority */}
        <button
          onClick={() => onFilterPriority('High')}
          className="text-left p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-700">High Priority</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700">{stats.highPriority}</div>
          <div className="text-[11px] text-purple-600/80 mt-0.5">Urgent priority</div>
        </button>
      </div>

      {/* Progress tracker bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-semibold">Sprint Completion Rate</span>
            <span className="text-slate-500">
              ({stats.completed} of {stats.total} tasks resolved)
            </span>
          </div>
          <span className="font-bold text-indigo-600 text-sm">
            {stats.completionRate}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-2.5 transition-all duration-500 rounded-l-full"
            style={{
              width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
            }}
            title={`Completed: ${stats.completed}`}
          />
          <div
            className="bg-blue-500 h-2.5 transition-all duration-500"
            style={{
              width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%`,
            }}
            title={`In Progress: ${stats.inProgress}`}
          />
          <div
            className="bg-amber-400 h-2.5 transition-all duration-500 rounded-r-full"
            style={{
              width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%`,
            }}
            title={`Pending: ${stats.pending}`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Completed ({stats.completed})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>In Progress ({stats.inProgress})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Pending ({stats.pending})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
