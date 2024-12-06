const ErrorHandler = require('../utils/errorHandler');

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.message = err.message || 'Internal Server Error';

//   res.status(err.statusCode).json({
//     success: false,
//     error: err.stack,
//     // message: err.message,
//   });
// };

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
  
//   if(process.env.NODE_ENV === 'DEVELOPMENT') {
//     res.status(err.statusCode).json({
//       success: false,
//       error: err,
//       errorMessage: err.message,
//       stack: err.stack,
//     });
//   }

//   if(process.env.NODE_ENV === 'PRODUCTION') {
//     let error = { ...err };
//     error.message = err.message;

//     res.status(err.statusCode).json({
//       success: false,
//       message: error.message || 'Internal Server Error',
//     });
//   }
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  if(process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errorMessage: err.message,
      stack: err.stack,
    });
  }

  if(process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err };
    error.message = err.message;

    if(err.name === 'CastError') {
      // error.message = `Resource not found. Invalid: ${err.path}`;
      // error.statusCode = 400;
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose validation error
    if(err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(
        value => value.message
      );
      error = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};