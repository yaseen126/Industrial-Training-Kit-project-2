import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  RefreshCw,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Package,
  Loader2,
  BarChart2
} from 'lucide-react';
import { StatsCard } from '../components/ui/StatsCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { analyticsService } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getStats();
      if (response && response.success) {
        setStats(response.data);
      } else {
        throw new Error(response?.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading OrderFlow Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-md mx-auto my-12 space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-rose-200">Unable to load dashboard</h3>
        <p className="text-xs text-rose-300/80">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    totalOrders = 0,
    pendingOrders = 0,
    processingOrders = 0,
    completedOrders = 0,
    recentOrders = []
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status monitoring and order processing metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-slate-400" />
            <span>View Orders</span>
          </Link>

          <Link
            to="/orders/new"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Order</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
          color="indigo"
          subtitle="All recorded orders"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          color="amber"
          subtitle="Awaiting fulfillment"
        />
        <StatsCard
          title="Processing Orders"
          value={processingOrders}
          icon={RefreshCw}
          color="blue"
          subtitle="Currently in progress"
        />
        <StatsCard
          title="Completed Orders"
          value={completedOrders}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Successfully delivered"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Section (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Package className="w-4.5 h-4.5 text-indigo-400" />
                Recent Orders
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest transactions placed in the system.</p>
            </div>

            <Link
              to="/orders"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {recentOrders.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">No recent orders recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/60 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Order ID</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-5 py-3.5 text-right">Price</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {recentOrders.map((order) => {
                      const totalPrice = (order.price || 0) * (order.quantity || 1);
                      return (
                        <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-400">
                            <Link to={`/orders/${order.id}`} className="hover:underline">
                              {order.id}
                            </Link>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-slate-200 text-xs">{order.customerName}</div>
                            <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-xs text-slate-300">
                            {order.productName} (x{order.quantity})
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-xs text-slate-100">
                            {formatCurrency(totalPrice)}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              to={`/orders/${order.id}`}
                              className="p-1.5 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Fulfillment Breakdown Sidebar Card */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4.5 h-4.5 text-indigo-400" />
              Status Summary
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across states.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
            {[
              { label: 'Pending', count: pendingOrders, color: 'bg-amber-400', textColor: 'text-amber-400' },
              { label: 'Processing', count: processingOrders, color: 'bg-blue-400', textColor: 'text-blue-400' },
              { label: 'Completed', count: completedOrders, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
            ].map((st) => {
              const percentage = totalOrders > 0 ? Math.round((st.count / totalOrders) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300">{st.label}</span>
                    <span className="text-slate-400">
                      <strong className={st.textColor}>{st.count}</strong> ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${st.color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Total Tracked Orders</span>
              <span className="font-bold text-slate-100">{totalOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
