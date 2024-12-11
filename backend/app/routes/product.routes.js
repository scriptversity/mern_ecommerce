const express = require('express');
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/').get(getProducts);
router.route('/:id').get(getSingleProduct);
router.route('/admin/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.route('/admin/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;