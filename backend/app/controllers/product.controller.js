const Product = require("../models/product.model");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Create new product => /api/v1/products/admin/new
exports.newProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// // Create new product => /api/v1/products/admin/new
// exports.newProduct = catchAsyncErrors(async (req, res, next) => {

//     const product = await Product.create(req.body);

//     res.status(201).json({
//       success: true,
//       product,
//     });

// });

// // Get all products => /api/v1/products
// exports.getProducts = async (req, res, next) => {
//   try {
//     const products = await Product.find();

//     if (!products) {
//       return res.status(404).json({
//         success: false,
//         message: 'No products found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error.message);

//     res.status(500).json({
//       success: false,
//       message: 'Server error. Please try again later.',
//     });
//   }
// };

// Get all products => /api/v1/products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    next(error); // Pass the error to the next middleware
  }
};

// // Get all products => /api/v1/products
// exports.getProducts = catchAsyncErrors(async (req, res, next) => {

//   const products = await Product.find();

//   res.status(200).json({
//     success: true,
//     count: products.length,
//     products,
//   });
// });

// // Get single product details => /api/v1/products/:id
// exports.getSingleProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     // if (!product) {
//     //   return res.status(404).json({
//     //     success: false,
//     //     message: 'Product not found',
//     //   });
//     // }

//     if (!product) {
//       return next(new ErrorHandler('Product not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error('Error fetching product:', error.message);

//     res.status(500).json({
//       success: false,
//       message: 'Server error. Please try again later.',
//     });
//   }
// };

// Get single product details => /api/v1/products/:id
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    next(error);
  }
};

// // Get single product details => /api/v1/products/:id
// exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHandler('Product not found', 404));
//   }

//   res.status(200).json({
//     success: true,
//     product,
//   });
// });

// // Update product => /api/v1/products/admin/:id
// exports.updateProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error('Error updating product:', error.message);

//     res.status(500).json({
//       success: false,
//       message: 'Server error. Please try again later.',
//     });
//   }
// };

// Update product => /api/v1/products/admin/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    next(error);
  }
};

// // Update product => /api/v1/products/admin/:id
// exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!product) {
//     return next(new ErrorHandler('Product not found', 404));
//   }

//   res.status(200).json({
//     success: true,
//     product,
//   });
// });

// // Delete product => /api/v1/products/admin/:id
// exports.deleteProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Product deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting product:', error.message);

//     res.status(500).json({
//       success: false,
//       message: 'Server error. Please try again later.',
//     });
//   }
// };

// Delete product => /api/v1/products/admin/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error.message);

    next(error);
  }
};

// // Delete product => /api/v1/products/admin/:id
// exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
//   const product = await Product.findByIdAndDelete(req.params.id);

//   if (!product) {
//     return res.status(404).json({
//       success: false,
//       message: 'Product not found',
//     });
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Product deleted successfully',
//   });
// });