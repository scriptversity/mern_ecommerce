class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;

// function ErrorHandler(message, statusCode) {
//   Error.call(this, message);
//   this.name = 'ErrorHandler';
//   this.statusCode = statusCode;

//   if (Error.captureStackTrace) {
//     Error.captureStackTrace(this, ErrorHandler);
//   } else {
//     this.stack = (new Error()).stack;
//   }
// }

// ErrorHandler.prototype = Object.create(Error.prototype);
// ErrorHandler.prototype.constructor = ErrorHandler;
