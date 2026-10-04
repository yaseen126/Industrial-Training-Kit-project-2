/**
 * Format number as currency string
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format ISO date string to human-readable format
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Returns badge styling classes based on order status
 * @param {string} status
 * @returns {string}
 */
export const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Processing':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Shipped':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'Delivered':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Cancelled':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
