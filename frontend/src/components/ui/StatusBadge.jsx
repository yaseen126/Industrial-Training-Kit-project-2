import React from 'react';

export const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Processing':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Completed':
    case 'Delivered':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Cancelled':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'Shipped':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const StatusBadge = ({ status }) => {
  const style = getStatusStyle(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
