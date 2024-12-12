const Product = require("../models/product.model");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

// Create new product => /api/v1/products/admin/new
exports.newProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
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

// // Get all products => /api/v1/products?keyword=apple
// exports.getProducts = async (req, res, next) => {
//   try {
//     const products = await Product.find();

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error.message);
//     next(error); // Pass the error to the next middleware
//   }
// };

// // Get all products => /api/v1/products
// exports.getProducts = catchAsyncErrors(async (req, res, next) => {
//   const products = await Product.find();

//   res.status(200).json({
//     success: true,
//     count: products.length,
//     products,
//   });
// });

// Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

  const resPerPage = 4;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productsCount,
    products,
  });
});

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

// Create new review => /api/v1/products/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings = product.reviews.reduce(
    (acc, item) => item.rating + acc,
    0
  ) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,  
  });
});

// Get all reviews of a product => /api/v1/products/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete review => /api/v1/products/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings = product.reviews.reduce(
    (acc, item) => item.rating + acc,
    0
  ) / reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      numOfReviews, 
      ratings,  
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});