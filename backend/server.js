const  app = require('./app/app');
const dotenv = require('dotenv');
const connectDatabase = require('./app/config/database');

dotenv.config({ path: './app/config/config.env' });
const port = process.env.PORT || 5000;

// Handle Uncaught Exception
process.on('uncaughtException', err => {
  console.log(`Error: ${err.message}`.red.underline.bold);
  console.log(`Error: ${err.stack}`.red.underline.bold);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

// console.log(a) // This will trigger the uncaughtException handler

// Connect to database
connectDatabase();

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode.`);
});

// Handle Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`.red.underline.bold);
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  server.close(() => {
    process.exit(1);
  });
});

// // Example of unhandled promise rejection
// Promise.reject(new Error('Example of an unhandled promise rejection'));