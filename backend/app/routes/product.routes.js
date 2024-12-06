const express = require('express');
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

router.route('/').get(getProducts);
router.route('/:id').get(getSingleProduct);
router.route('/admin/new').post(newProduct);
router.route('/admin/:id')
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;