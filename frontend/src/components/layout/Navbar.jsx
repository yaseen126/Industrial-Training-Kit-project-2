import React from 'react';
import { Menu, Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-slate-300 hidden sm:inline-block">
          Order Management Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/orders/new"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Order</span>
        </Link>

        <div className="h-5 w-[1px] bg-slate-800 mx-1"></div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-none">Admin Account</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};
