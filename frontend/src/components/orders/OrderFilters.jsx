import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';

export const OrderFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}) => {
  const statusOptions = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];
  const hasActiveFilters = Boolean(search.trim() !== '' || (statusFilter && statusFilter !== 'All'));

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order ID, Customer Name, or Product Name..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Controls & Clear Button */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium shadow-sm flex-1 sm:flex-initial">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer w-full"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st} className="bg-slate-800 text-slate-100">
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
            title="Clear all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
