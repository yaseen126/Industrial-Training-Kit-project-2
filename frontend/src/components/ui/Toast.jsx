import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useOrderContext } from '../../context/OrderContext';

export const Toast = () => {
  const { toast, hideToast } = useOrderContext();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl bg-slate-900/95 border-slate-700/80 text-slate-100 backdrop-blur-md transition-all">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}

      <span className="text-xs font-semibold pr-2">{toast.message}</span>

      <button
        onClick={hideToast}
        className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
