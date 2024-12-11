const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler('User not found', 404));
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Session expired. Please login again.', 401));
    } else if (error.name === 'JsonWebTokenError') {
      return next(new ErrorHandler('Invalid token. Please login again.', 401));
    } else {
      console.error(`Authentication error: ${error.message}`);
      return next(new ErrorHandler('Internal server error', 500));
    }
  }
});

// const catchAsyncErrors = require("./catchAsyncErrors");
// const ErrorHandler = require("../utils/errorHandler");
// const jwt = require("jsonwebtoken");
// const User = require("../models/user.model");

// // Cheks if user is authenticated or not
// exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;

//   // if(!token) {
//   //   return res.status(401).json({
//   //     success: false,
//   //     message: 'Please login to access this resource',
//   //   });
//   // }

//   // next();
//   if (!token) {
//     return next(new ErrorHandler('Please login to access this resource', 401));
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   req.user = await User.findById(decoded.id);
//   next();
// });

// Checks if user is admin or not
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // return res.status(403).json({
      //   success: false,
      //   message: 'You are not authorized to access this resource',
      // });
      return next(new ErrorHandler('You are not authorized to access this resource', 403));
    }
    next();
  };
};

// // Checks if user is admin or not( a more robust version)
// exports.authorizeRoles = (...roles) => {
//   return catchAsyncErrors(async (req, res, next) => {
//     if (!req.user || !req.user.role) {
//       return next(new ErrorHandler('User information not found. Please log in.', 401));
//     }

//     if (!roles.includes(req.user.role)) {
//       console.warn(`Unauthorized access attempt by user: ${req.user.id}, role: ${req.user.role}`);
//       return next(new ErrorHandler('You are not authorized to access this resource', 403));
//     }

//     next();
//   });
// };
