import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Circle,
  CheckCircle2,
  Edit2,
  Trash2,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';

export const TaskList = ({
  tasks,
  loading,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onNewTask,
  onSeedSample,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDeadline = (dueDateStr, status) => {
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (status === 'Completed') {
      return {
        text: `Resolved: ${due.toLocaleDateString()}`,
        isOverdue: false,
        style: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      };
    }

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        text: `Overdue by ${daysAgo} day${daysAgo > 1 ? 's' : ''}`,
        isOverdue: true,
        style: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold animate-pulse',
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        isOverdue: false,
        style: 'text-amber-800 bg-amber-50 border-amber-300 font-semibold',
      };
    } else if (diffDays === 1) {
      return {
        text: 'Due Tomorrow',
        isOverdue: false,
        style: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    } else {
      return {
        text: `Due in ${diffDays} days`,
        isOverdue: false,
        style: 'text-slate-600 bg-slate-50 border-slate-200',
      };
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-4 rounded-xl bg-white border border-slate-200 animate-pulse flex flex-col gap-3"
          >
            <div className="h-4 bg-slate-200 rounded-md w-1/3" />
            <div className="h-3 bg-slate-100 rounded-md w-3/4" />
            <div className="h-3 bg-slate-100 rounded-md w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <FolderOpen className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No tasks found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          There are no tasks matching your current filters or in your queue. Create a new task or populate demo records.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onNewTask}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-semibold shadow-xs"
          >
            Create First Task
          </button>
          <button
            onClick={onSeedSample}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
          >
            Load Sample Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const deadline = formatDeadline(task.dueDate, task.status);
        const isCompleted = task.status === 'Completed';

        return (
          <div
            key={task._id}
            className={`group p-4 rounded-xl bg-white border transition-all duration-200 shadow-2xs hover:shadow-xs ${
              deadline.isOverdue
                ? 'border-rose-200/80 hover:border-rose-300'
                : isCompleted
                ? 'border-slate-200/60 bg-slate-50/40 opacity-90'
                : 'border-slate-200/90 hover:border-indigo-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              {/* Left Column: Checkbox toggle & Content */}
              <div className="flex items-start gap-3 flex-1">
                {/* Status Toggle Button */}
                <button
                  onClick={() => {
                    const nextStatus =
                      task.status === 'Completed'
                        ? 'Pending'
                        : task.status === 'Pending'
                        ? 'In Progress'
                        : 'Completed';
                    onStatusChange(task._id, nextStatus);
                  }}
                  className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  title={`Status: ${task.status}. Click to cycle.`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                  ) : task.status === 'In Progress' ? (
                    <Clock className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Circle className="h-5 w-5 hover:text-slate-600" />
                  )}
                </button>

                {/* Title & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4
                      className={`text-sm font-semibold text-slate-900 leading-snug break-words ${
                        isCompleted ? 'line-through text-slate-400 font-normal' : ''
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  {task.description && (
                    <p
                      className={`text-xs text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed ${
                        isCompleted ? 'text-slate-400' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Metadata Row: Due Date & Timestamps */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                    {/* Deadline Pill */}
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${deadline.style}`}
                    >
                      {deadline.isOverdue ? (
                        <AlertTriangle className="h-3 w-3 stroke-[2.2]" />
                      ) : (
                        <Calendar className="h-3 w-3 stroke-[2]" />
                      )}
                      <span>{deadline.text}</span>
                    </div>

                    {/* Raw Due Date */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>Target:</span>
                      <span className="font-medium text-slate-700">
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="text-[11px] text-slate-400 hidden md:block">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-1 self-end sm:self-start pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 w-full sm:w-auto justify-end">
                {/* Quick Status Dropdown */}
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task._id, e.target.value)}
                  className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-1 px-2 rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                {/* Edit Button */}
                <button
                  onClick={() => onEditTask(task)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Task"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                {/* Delete Button / Confirm */}
                {deleteConfirmId === task._id ? (
                  <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded-lg border border-rose-200">
                    <button
                      onClick={() => {
                        onDeleteTask(task._id);
                        setDeleteConfirmId(null);
                      }}
                      className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-1.5 py-0.5 text-[11px] text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(task._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
