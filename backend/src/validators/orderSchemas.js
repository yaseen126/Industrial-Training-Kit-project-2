/**
 * Server-side order validation for POST /api/orders
 * Rules:
 * - customerName is required
 * - customerEmail is required and must be a valid email
 * - productName is required
 * - quantity must be a positive number (> 0)
 * - price must be a positive number (> 0)
 * - status is required and must be one of: Pending, Processing, Completed, Cancelled
 *
 * @param {Object} body
 * @returns {{isValid: boolean, errors: string[]}}
 */
function validateCreateOrder(body) {
  const errors = [];

  const { customerName, customerEmail, productName, quantity, price, status } = body || {};

  // 1. customerName validation
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    errors.push('Customer name is required');
  }

  // 2. customerEmail validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customerEmail || typeof customerEmail !== 'string' || customerEmail.trim().length === 0) {
    errors.push('Customer email is required');
  } else if (!emailRegex.test(customerEmail.trim())) {
    errors.push('Customer email must be a valid email address');
  }

  // 3. productName validation
  if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
    errors.push('Product name is required');
  }

  // 4. quantity validation (must be positive number > 0)
  const parsedQty = Number(quantity);
  if (quantity === undefined || quantity === null || isNaN(parsedQty) || parsedQty <= 0) {
    errors.push('Quantity must be a positive number');
  }

  // 5. price validation (must be positive number > 0)
  const parsedPrice = Number(price);
  if (price === undefined || price === null || isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.push('Price must be a positive number');
  }

  // 6. status validation (must be one of Pending, Processing, Completed, Cancelled)
  const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
  if (!status || typeof status !== 'string' || status.trim().length === 0) {
    errors.push('Status is required');
  } else if (!validStatuses.includes(status.trim())) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateCreateOrder
};
