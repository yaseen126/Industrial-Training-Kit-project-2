const storage = require('../data/storage');
const { validateCreateOrder } = require('../validators/orderSchemas');

/**
 * GET /api/orders
 * Purpose: Return all orders
 * Responds with HTTP 200
 */
function getOrders(req, res) {
  try {
    let orders = storage.getOrders();
    const { status, search, sortBy } = req.query;

    // Filter by Status if provided
    if (status && status !== 'All') {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    // Search filter if provided
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q)
      );
    }

    // Sort if provided
    if (sortBy === 'newest') {
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'amount_high') {
      orders.sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity));
    } else if (sortBy === 'amount_low') {
      orders.sort((a, b) => (a.price * a.quantity) - (b.price * b.quantity));
    }

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errors: [error.message]
    });
  }
}

/**
 * GET /api/orders/:id
 * Purpose: Return one specific order by ID
 * Responds with HTTP 200 or 404
 */
function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = storage.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${id}' not found`,
        errors: [`Order '${id}' does not exist`]
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errors: [error.message]
    });
  }
}

/**
 * POST /api/orders
 * Purpose: Create a new order from user input with strict server-side validation
 * Responds with HTTP 201 on success or HTTP 400 on validation failure
 */
function createOrder(req, res) {
  try {
    const { isValid, errors } = validateCreateOrder(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const { customerName, customerEmail, productName, quantity, price, status } = req.body;

    const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `ORD-${randomIdNumber}`,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      productName: productName.trim(),
      quantity: Number(quantity),
      price: Number(price),
      status: status.trim(),
      createdAt: new Date().toISOString()
    };

    const savedOrder = storage.saveOrder(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errors: [error.message]
    });
  }
}

/**
 * PATCH /api/orders/:id/status
 * Purpose: Update status of an existing order
 */
function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled', 'Shipped', 'Delivered'];
    if (!status || typeof status !== 'string' || !validStatuses.includes(status.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [`Status must be one of: ${validStatuses.join(', ')}`]
      });
    }

    const updatedOrder = storage.updateOrderStatus(id, status.trim());

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${id}' not found`,
        errors: [`Order '${id}' does not exist`]
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errors: [error.message]
    });
  }
}

/**
 * DELETE /api/orders/:id
 * Purpose: Delete an existing order
 */
function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const success = storage.deleteOrder(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${id}' not found`,
        errors: [`Order '${id}' does not exist`]
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: { id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errors: [error.message]
    });
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
};
