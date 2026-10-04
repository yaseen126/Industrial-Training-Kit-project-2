import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Hash
} from 'lucide-react';
import { productService, orderService } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { useOrderContext } from '../context/OrderContext';

export const AddOrder = () => {
  const navigate = useNavigate();
  const { showToast } = useOrderContext();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form Initial State
  const initialFormState = {
    customerName: '',
    customerEmail: '',
    productName: '',
    quantity: 1,
    price: '',
    status: 'Pending'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [frontendErrors, setFrontendErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Load product catalog for dropdown convenience
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await productService.getProducts();
        if (response && response.success && Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (err) {
        // Non-blocking error: fallback to manual text input
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Field change handler
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-level error when user types
    if (frontendErrors[field]) {
      setFrontendErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Product selection auto-populates price
  const handleProductSelect = (selectedName) => {
    const matched = products.find(p => p.name === selectedName);
    setFormData(prev => ({
      ...prev,
      productName: selectedName,
      price: matched ? matched.price : prev.price
    }));
    if (frontendErrors.productName) {
      setFrontendErrors(prev => {
        const updated = { ...prev };
        delete updated.productName;
        return updated;
      });
    }
  };

  // Client-side validation function
  const validateForm = () => {
    const errors = {};

    // Customer Name rule: cannot be empty
    if (!formData.customerName || formData.customerName.trim() === '') {
      errors.customerName = 'Customer Name is required';
    }

    // Customer Email rule: cannot be empty & must be valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail || formData.customerEmail.trim() === '') {
      errors.customerEmail = 'Customer Email is required';
    } else if (!emailRegex.test(formData.customerEmail.trim())) {
      errors.customerEmail = 'Please enter a valid email address';
    }

    // Product Name rule: cannot be empty
    if (!formData.productName || formData.productName.trim() === '') {
      errors.productName = 'Product Name is required';
    }

    // Quantity rule: must be greater than 0
    const qtyNum = Number(formData.quantity);
    if (formData.quantity === '' || isNaN(qtyNum) || qtyNum <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    // Price rule: must be greater than 0
    const priceNum = Number(formData.price);
    if (formData.price === '' || isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    // Status rule: must be selected
    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!formData.status || !validStatuses.includes(formData.status)) {
      errors.status = 'Status must be selected';
    }

    setFrontendErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors([]);

    // 1. Run Frontend Validation
    if (!validateForm()) {
      showToast('Please fix the validation errors before submitting.', 'error');
      return;
    }

    // 2. Submit to POST /api/orders
    try {
      setSubmitting(true);
      const payload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        productName: formData.productName.trim(),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        status: formData.status
      };

      const response = await orderService.createOrder(payload);

      if (response && response.success) {
        // Success notification
        showToast(`Order ${response.data.id} created successfully!`, 'success');
        
        // Reset form
        setFormData(initialFormState);
        setFrontendErrors({});
        setBackendErrors([]);

        // Redirect to Orders list page
        navigate('/orders');
      } else {
        throw new Error(response?.message || 'Failed to create order');
      }
    } catch (err) {
      // Handle Backend Validation Errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        setBackendErrors(err.response.data.errors);
        showToast(err.response.data.message || 'Validation failed on server', 'error');
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Server error occurred while creating order';
        setBackendErrors([errorMsg]);
        showToast(errorMsg, 'error');
      }
      // User-entered input is preserved in formData state
    } finally {
      setSubmitting(false);
    }
  };

  const calculatedTotal = (Number(formData.price) || 0) * (Number(formData.quantity) || 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Add New Order</h1>
            <p className="text-xs text-slate-400 mt-0.5">Enter order parameters to submit to the backend API.</p>
          </div>
        </div>
      </div>

      {/* Backend Validation Errors Display Box */}
      {backendErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Backend Validation Failed:
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-rose-300">
            {backendErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Order Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-bold text-slate-200">
            <User className="w-4 h-4 text-indigo-400" />
            Customer Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Customer Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                placeholder="e.g. Alex Morgan"
                className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  frontendErrors.customerName ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {frontendErrors.customerName && (
                <span className="text-[11px] text-rose-400 mt-1.5 block">{frontendErrors.customerName}</span>
              )}
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Customer Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
                placeholder="alex@example.com"
                className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  frontendErrors.customerEmail ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {frontendErrors.customerEmail && (
                <span className="text-[11px] text-rose-400 mt-1.5 block">{frontendErrors.customerEmail}</span>
              )}
            </div>
          </div>
        </div>

        {/* Product & Pricing Details Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-bold text-slate-200">
            <Package className="w-4 h-4 text-indigo-400" />
            Product & Pricing Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Product Name <span className="text-rose-400">*</span>
              </label>
              {products.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={formData.productName}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition-colors ${
                      frontendErrors.productName ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                    }`}
                  >
                    <option value="">Select a product or type custom...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({formatCurrency(p.price)})
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Text Input fallback for custom product name */}
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder="e.g. Ergonomic Office Chair"
                className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  products.length > 0 ? 'mt-2' : ''
                } ${frontendErrors.productName ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'}`}
              />
              {frontendErrors.productName && (
                <span className="text-[11px] text-rose-400 mt-1.5 block">{frontendErrors.productName}</span>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Quantity <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="1"
                  className={`w-full bg-slate-800/80 border rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                    frontendErrors.quantity ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
              </div>
              {frontendErrors.quantity && (
                <span className="text-[11px] text-rose-400 mt-1.5 block">{frontendErrors.quantity}</span>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Price Per Unit ($) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  className={`w-full bg-slate-800/80 border rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                    frontendErrors.price ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
              </div>
              {frontendErrors.price && (
                <span className="text-[11px] text-rose-400 mt-1.5 block">{frontendErrors.price}</span>
              )}
            </div>

            {/* Status Selector */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Initial Order Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={`w-full bg-slate-800/80 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition-colors ${
                  frontendErrors.status ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {frontendErrors.status && (
                <span className="text-[11px] text-rose-400 mt-1.5 block">{frontendErrors.status}</span>
              )}
            </div>
          </div>

          {/* Real-time calculated total summary */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-slate-200">
            <span>Calculated Total Amount:</span>
            <span className="text-indigo-400 text-base">{formatCurrency(calculatedTotal)}</span>
          </div>
        </div>

        {/* Submit Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/orders"
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Submitting Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Order</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
