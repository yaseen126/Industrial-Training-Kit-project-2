import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Trash2,
  User,
  Package,
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  Tag,
  RefreshCw,
  FileQuestion
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { orderService } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useOrderContext } from '../context/OrderContext';

export const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useOrderContext();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      const response = await orderService.getOrderById(id);

      if (response && response.success && response.data) {
        setOrder(response.data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        const errorMsg = err.response?.data?.message || err.message || `Unable to load Order '${id}'`;
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await orderService.updateOrderStatus(id, newStatus);
      if (response && response.success) {
        setOrder(response.data);
        showToast(`Order ${id} status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete order ${id}?`)) return;

    try {
      const response = await orderService.deleteOrder(id);
      if (response && response.success) {
        showToast(`Order ${id} deleted successfully.`, 'success');
        navigate('/orders');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete order', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Fetching Order {id} details...</p>
      </div>
    );
  }

  // 2. Professional 404 / Not Found State
  if (notFound) {
    return (
      <div className="p-10 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto">
          <FileQuestion className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-100">Order Not Found</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Order <span className="font-mono text-indigo-400">{id}</span> does not exist or may have been removed.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/orders"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Orders Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. API Connection Error State
  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-md mx-auto my-12 space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-rose-200">API Connection Error</h3>
        <p className="text-xs text-rose-300/80">{error}</p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={fetchOrder}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
          <Link
            to="/orders"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const statuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
  const unitPrice = order.price || 0;
  const quantity = order.quantity || 1;
  const totalAmount = unitPrice * quantity;

  return (
    <div className="space-y-8 max-w-4xl mx-auto print:p-0 print:m-0">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold font-mono text-indigo-400 tracking-tight">{order.id}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Created on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium">
            <span className="text-slate-400">Update Status:</span>
            <select
              value={order.status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              {statuses.map(st => (
                <option key={st} value={st} className="bg-slate-800 text-slate-100">
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
            title="Print Invoice"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Order Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-indigo-400" />
            Customer Details
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Customer Name</span>
              <span className="text-sm font-semibold text-slate-100">{order.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Customer Email</span>
              <span className="text-slate-200 font-medium">{order.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Order Metadata Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
            <Tag className="w-4 h-4 text-indigo-400" />
            Order Metadata
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Order ID:</span>
              <span className="font-mono text-indigo-400 font-bold text-sm">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status:</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Created Date:</span>
              <span className="text-slate-300 font-medium">{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Item & Price Breakdown Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            Product Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Product Name</th>
                <th className="px-6 py-3.5 text-right">Unit Price</th>
                <th className="px-6 py-3.5 text-center">Quantity</th>
                <th className="px-6 py-3.5 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-100">{order.productName}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-300">{formatCurrency(unitPrice)}</td>
                <td className="px-6 py-4 text-center font-bold text-slate-200">{quantity}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-100">
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary Row */}
        <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Unit Price</span>
              <span className="font-semibold text-slate-200">{formatCurrency(unitPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Quantity</span>
              <span className="font-semibold text-slate-200">x{quantity}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-slate-100">
              <span>Total Amount</span>
              <span className="text-indigo-400 text-base">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
