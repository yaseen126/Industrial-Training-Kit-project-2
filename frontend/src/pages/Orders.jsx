import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, ShoppingBag, AlertCircle } from 'lucide-react';
import { OrderFilters } from '../components/orders/OrderFilters';
import { OrderTable } from '../components/orders/OrderTable';
import { orderService } from '../services/api';
import { useOrderContext } from '../context/OrderContext';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { showToast } = useOrderContext();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim() !== '') params.search = search.trim();
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;

      const response = await orderService.getOrders(params);

      if (response && response.success) {
        setOrders(response.data || []);
      } else {
        throw new Error(response?.message || 'Failed to fetch orders from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unable to connect to the backend server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, statusFilter, fetchOrders]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(id, newStatus);
      if (response.success) {
        showToast(`Order ${id} status updated to ${newStatus}`, 'success');
        fetchOrders();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('All');
  };

  const hasActiveFilters = Boolean(search.trim() !== '' || statusFilter !== 'All');

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View, filter, and manage all customer order records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/orders/new"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Order</span>
          </Link>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Error Banner with Retry Button */}
      {error ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-lg mx-auto my-8 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-rose-200">Failed to load orders</h3>
          <p className="text-xs text-rose-300/80">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      ) : (
        /* Orders Table Container */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <OrderTable
            orders={orders}
            onStatusChange={handleStatusChange}
            isLoading={loading}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}
    </div>
  );
};
