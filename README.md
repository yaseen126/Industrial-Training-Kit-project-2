# 📦 OrderFlow - Order Management System

![OrderFlow Banner](https://img.shields.io/badge/OrderFlow-Full%20Stack%20OMS-indigo?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20REST%20API-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-amber?style=flat-square)

**OrderFlow** is a portfolio-ready full-stack Order Management Application engineered to showcase **Backend API Development**, strict server-side input validation, clean RESTful architecture, and a modern SaaS frontend interface.

---

## 🚀 Key Application Features

- **📊 Executive Dashboard**: Real-time KPI statistics cards (Total Orders, Pending Orders, Processing Orders, Completed Orders), status distribution breakdown visualizer, and recent activity log.
- **📑 Order Directory**: Responsive data grid featuring real-time debounced multi-property search (Customer Name, Product Name, Order ID) and status filtering (`All`, `Pending`, `Processing`, `Completed`, `Cancelled`).
- **📝 Validated Order Creation**: Interactive order placement form backed by client-side and strict server-side validation rejecting malformed requests with `HTTP 400 Bad Request`.
- **🧾 Invoice & Detail View**: Single-order invoice summary displaying itemized breakdowns, total price calculations, customer metadata, and interactive status modifiers.
- **🛡️ Resilient UX States**: Animated loading indicators (`Loader2`), contextual empty states (`SearchX`), error alert banners with **Retry Connection** controls, and toast notifications.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Dark Mode Slate palette: `slate-950`/`slate-900`/`slate-800`, Inter font family)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios (Centralized API service layer in `src/services/api.js`)
- **State Management**: React Context API (`OrderContext`)

### Backend
- **Runtime Environment**: Node.js (CommonJS)
- **Framework**: Express.js REST API
- **Data Persistence**: File-backed JSON Database (`backend/src/data/storage.js`) with seed fallback
- **Middleware**: Express JSON parser, CORS, Request Logger, Central Error Handler (`errorHandler.js`)
- **Validation**: Dedicated server-side validator module (`backend/src/validators/orderSchemas.js`)

---

## 📂 Project Directory Structure

```
Industrial Training Kit project 2/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── controllers/
│       │   ├── analyticsController.js
│       │   ├── orderController.js
│       │   └── productController.js
│       ├── data/
│       │   ├── db.json
│       │   ├── seedData.js
│       │   └── storage.js
│       ├── middleware/
│       │   └── errorHandler.js
│       ├── routes/
│       │   ├── analyticsRoutes.js
│       │   ├── orderRoutes.js
│       │   └── productRoutes.js
│       └── validators/
│           └── orderSchemas.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── Layout.jsx
        │   │   ├── Navbar.jsx
        │   │   └── Sidebar.jsx
        │   ├── orders/
        │   │   ├── OrderFilters.jsx
        │   │   └── OrderTable.jsx
        │   └── ui/
        │       ├── StatsCard.jsx
        │       ├── StatusBadge.jsx
        │       └── Toast.jsx
        ├── context/
        │   └── OrderContext.jsx
        ├── pages/
        │   ├── AddOrder.jsx
        │   ├── Dashboard.jsx
        │   ├── OrderDetails.jsx
        │   └── Orders.jsx
        ├── services/
        │   └── api.js
        ├── utils/
        │   └── formatters.js
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## 📡 Backend API Endpoints & Specification

### Data Model
```json
{
  "id": "ORD-9021",
  "customerName": "Sophia Martinez",
  "customerEmail": "sophia.m@example.com",
  "productName": "Wireless Mechanical Keyboard",
  "quantity": 1,
  "price": 129.99,
  "status": "Delivered",
  "createdAt": "2026-10-01T14:32:00.000Z"
}
```

### Endpoints Overview

| HTTP Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/orders` | Return all orders (supports `search` & `status` query params) | `200 OK`, `500 Server Error` |
| `GET` | `/api/orders/:id` | Return single order by ID | `200 OK`, `404 Not Found`, `500 Server Error` |
| `POST` | `/api/orders` | Create a new order with server-side validation | `201 Created`, `400 Bad Request`, `500 Server Error` |
| `PATCH` | `/api/orders/:id/status` | Update order fulfillment status | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/orders/:id` | Delete/Cancel an order | `200 OK`, `404 Not Found` |
| `GET` | `/api/analytics/stats` | Dashboard KPI metrics & status counts | `200 OK`, `500 Server Error` |
| `GET` | `/api/products` | Retrieve catalog inventory | `200 OK` |

---

## 🛡️ Server-Side Validation Rules (`POST /api/orders`)

| Field | Rule | Error Message on Failure |
|---|---|---|
| `customerName` | Required non-empty string | `"Customer name is required"` |
| `customerEmail` | Required valid email pattern | `"Customer email is required"` / `"Customer email must be a valid email address"` |
| `productName` | Required non-empty string | `"Product name is required"` |
| `quantity` | Required positive number (`> 0`) | `"Quantity must be a positive number"` |
| `price` | Required positive number (`> 0`) | `"Price must be a positive number"` |
| `status` | Must be one of: `Pending`, `Processing`, `Completed`, `Cancelled` | `"Status is required"` / `"Status must be one of: Pending, Processing, Completed, Cancelled"` |

---

## ⚡ Getting Started (Run Instructions)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- Git

### 2. Running the Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start Express server
npm start
```
- Server will run on: **`http://localhost:5000`** (Base API: `http://localhost:5000/api`)

### 3. Running the Frontend Application
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Web application will run on: **`http://localhost:5173`**

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
