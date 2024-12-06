const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_LOCAL_URI);
    console.log(`MongoDB Connected to: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
}

const gracefulShutdown = (signal) => {
  return (err) => {
    console.log(`Received ${signal}. Closing MongoDB connection.`.yellow);
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed.'.yellow);
      process.exit(err ? 1 : 0);
    });
  }
};

process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));

module.exports = connectDB;

// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.DB_LOCAL_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
//   } catch (error) {
//     console.log(`Error: ${error.message}`.red.underline.bold);
//     process.exit(1);
//   }
// }

// module.exports = connectDB;