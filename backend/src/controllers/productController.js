const storage = require('../data/storage');

/**
 * GET /api/products
 * Retrieves available product inventory catalog
 */
function getProducts(req, res) {
  try {
    const products = storage.getProducts();
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products catalog',
      error: error.message
    });
  }
}

module.exports = {
  getProducts
};
