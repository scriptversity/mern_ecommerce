const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));
// const cors = require('cors');

const errorMiddleware = require('./middlewares/errors');

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());

// Import routes
const routes = require('./routes');

app.use("/api/v1",routes);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;