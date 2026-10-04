import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { AddOrder } from './pages/AddOrder';
import { OrderDetails } from './pages/OrderDetails';
import { OrderProvider } from './context/OrderContext';

export default function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/new" element={<AddOrder />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </OrderProvider>
  );
}
