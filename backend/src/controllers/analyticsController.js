const storage = require('../data/storage');

/**
 * GET /api/analytics/stats
 * Provides dashboard KPIs matching requested statistics:
 * - Total Orders
 * - Pending Orders
 * - Processing Orders
 * - Completed Orders
 */
function getDashboardStats(req, res) {
  try {
    const orders = storage.getOrders();

    const totalOrders = orders.length;
    let pendingOrders = 0;
    let processingOrders = 0;
    let completedOrders = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      const orderTotal = (order.price || 0) * (order.quantity || 1);
      totalRevenue += orderTotal;

      const st = (order.status || '').toLowerCase();
      if (st === 'pending') {
        pendingOrders++;
      } else if (st === 'processing') {
        processingOrders++;
      } else if (st === 'completed' || st === 'delivered') {
        completedOrders++;
      }
    });

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        recentOrders
      }
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
  getDashboardStats
};
