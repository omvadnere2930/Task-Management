import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  X,
  AlertCircle,
} from 'lucide-react';

export const TaskFilters = ({
  filters,
  onChange,
  onAddTask,
  totalResults,
}) => {
  const updateFilter = (updates) => {
    onChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onChange({
      search: '',
      status: 'All',
      priority: 'All',
      overdue: false,
      sortBy: 'dueDate',
      order: 'asc',
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.overdue;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
      {/* Top Row: Search and Add Task Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            placeholder="Search tasks by title or description..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Add Task Primary CTA */}
        <button
          onClick={onAddTask}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-xs shadow-indigo-600/30 transition-all hover:scale-[1.01] whitespace-nowrap"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Middle/Bottom Row: Filter chips & Sort dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Status:
          </span>
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => updateFilter({ status })}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filters.status === status
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Priority:</span>
          <select
            value={filters.priority}
            onChange={(e) => updateFilter({ priority: e.target.value })}
            className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md border-0 focus:ring-1 focus:ring-indigo-500 text-xs cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Overdue Checkbox Toggle */}
        <button
          onClick={() => updateFilter({ overdue: !filters.overdue })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border transition-colors ${
            filters.overdue
              ? 'bg-rose-50 text-rose-700 border-rose-300 font-semibold'
              : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200/80'
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Overdue Only</span>
        </button>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              updateFilter({
                sortBy: e.target.value,
              })
            }
            className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md border-0 focus:ring-1 focus:ring-indigo-500 text-xs cursor-pointer"
          >
            <option value="dueDate">Due Date (Deadline)</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {/* Toggle Order (asc / desc) */}
          <button
            onClick={() =>
              updateFilter({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
            className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            title={`Sort order: ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold ml-2 underline underline-offset-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
