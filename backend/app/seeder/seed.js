const Product = require('../models/product.model');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const products = require('../data/products');

// Load environment variables
dotenv.config({ path: './app/config/config.env' });

// Connect to the database
connectDatabase();

const seedProducts = async () => {
  try {
    // Delete all existing products
    await Product.deleteMany();
    console.log('All products have been deleted.');

    // Insert new products
    await Product.insertMany(products);
    console.log('All products have been added.');

    // Close the database connection gracefully
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error.message);

    // Close the database connection gracefully on error
    process.exit(1);
  }
};

// Execute the seed function
seedProducts();
