const User = require('../models/user.model');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register a new user => /api/v1/users/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'this is a sample id',
      url: 'profilePicUrl',
    },
  });

  // const token = user.getJwtToken();

  // res.status(201).json({
  //   success: true,
  //   // user,
  //   token,
  // });

  sendToken(user, 201, res);
});

// Login user => /api/v1/users/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // const token = user.getJwtToken();

  // res.status(200).json({
  //   success: true,
  //   // user,    
  //   token,
  // });

  sendToken(user, 200, res);
});

// Forgot password => /api/v1/users/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Ecommerce Password Recovery',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password => /api/v1/users/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// // Get currently logged in user details => /api/v1/users/me
// exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// Get currently logged in user details => /api/v1/users/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpire');

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update / Change password => /api/v1/users/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400));
  }

  // if (req.body.newPassword !== req.body.confirmPassword) {
  //   return next(new ErrorHandler('Password does not match', 400));
  // }

  // user.password = req.body.newPassword;
  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

// Update user profile => /api/v1/users/me/update
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar
  // It will be implemented later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout user => /api/v1/users/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
    sameSite: 'strict', // Add SameSite attribute
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

// Admin routes

// Get all users => /api/v1/users/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  // // If we want to show only active users && if we are applying soft delete
  // const users = await User.find({ deleted: { $ne: true } });

  res.status(200).json({
    success: true,
    users,
  });
});

// // Get all users => /api/v1/users/admin
// exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
//   const pageSize = Number(req.query.pageSize) || 10;
//   const page = Number(req.query.page) || 1;

//   const query = {};
//   const users = await User.find(query)
//     .select('-password -resetPasswordToken -resetPasswordExpire')
//     .skip(pageSize * (page - 1))
//     .limit(pageSize);

//   const totalUsers = await User.countDocuments(query);

//   res.status(200).json({
//     success: true,
//     users,
//     page,
//     pages: Math.ceil(totalUsers / pageSize),
//   });
// });

// // Get user details => /api/v1/users/admin/user/:id
// exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
//   }

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// Get user details => /api/v1/users/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // // Validate the user ID. To use this, you need to import mongoose
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return next(new ErrorHandler(`Invalid user ID: ${id}`, 400));
  // }

  // Log the user ID being queried
  console.log(`Fetching details for user ID: ${id}`);

  const user = await User.findById(id).select('-password -resetPasswordToken -resetPasswordExpire');

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user profile => /api/v1/users/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});


// // const cloudinary = require('cloudinary').v2;

// // // Configure Cloudinary
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// // Delete user => /api/v1/users/admin/user/:id
// exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
//   }
  
//   // // Remove avatar from Cloudinary
//   // const avatarId = user.avatar.public_id;
//   // if (avatarId) {
//   //   await cloudinary.uploader.destroy(avatarId);
//   // }

//   // Delete user from database
//   await User.findByIdAndDelete(req.params.id);

//   res.status(200).json({
//     success: true,
//     message: 'User deleted successfully',
//   });
// });

// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Delete user => /api/v1/users/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
  }

  // Remove avatar from Cloudinary
  // const avatarId = user.avatar.public_id;
  // if (avatarId) {
  //   await cloudinary.uploader.destroy(avatarId);
  // }

  // Delete user from database
  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});


// //  Delete user => /api/v1/users/admin/user/:id
// exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findByIdAndDelete(req.params.id);

//   if (!user) {
//     return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
//   }
  
//   res.status(200).json({
//     success: true,
//     message: 'User deleted successfully',
//   });
// });


// // Soft delete user => /api/v1/users/admin/user/:id
// exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
//   }

//   user.deleted = true;
//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: 'User soft deleted successfully',
//   });
// });
