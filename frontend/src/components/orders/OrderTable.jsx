import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Package, Loader2, SearchX, RotateCcw } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderTable = ({ orders, onStatusChange, isLoading, hasActiveFilters, onClearFilters }) => {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium">Fetching orders from server...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          {hasActiveFilters ? <SearchX className="w-6 h-6 text-amber-400" /> : <Package className="w-6 h-6" />}
        </div>
        <h3 className="text-base font-semibold text-slate-200">
          {hasActiveFilters ? 'No Matching Orders Found' : 'No Orders Available'}
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {hasActiveFilters
            ? 'No orders matched your search query or status filter. Try clearing filters or changing search keywords.'
            : 'There are currently no orders in the system. Click "Add Order" to create a new order record.'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  const statuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Customer Name</th>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4 text-center">Quantity</th>
            <th className="px-6 py-4 text-right">Price</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created Date</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {orders.map((order) => {
            const totalPrice = (order.price || 0) * (order.quantity || 1);

            return (
              <tr
                key={order.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* Order ID */}
                <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-400">
                  <Link to={`/orders/${order.id}`} className="hover:underline">
                    {order.id}
                  </Link>
                </td>

                {/* Customer Name & Email */}
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-200">{order.customerName}</div>
                  <div className="text-xs text-slate-400">{order.customerEmail}</div>
                </td>

                {/* Product Name */}
                <td className="px-6 py-4 font-medium text-slate-200">
                  {order.productName}
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 text-center font-semibold text-slate-300">
                  {order.quantity}
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-right font-semibold text-slate-100 whitespace-nowrap">
                  {formatCurrency(totalPrice)}
                </td>

                {/* Status Dropdown */}
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 px-2.5 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>

                {/* Action: View Details */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
