const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: [],
  credentials: true
}));

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/auth', require('./controllers/auth'));
app.use('/api/v1/products', require('./controllers/productsController'));
app.use('/api/v1/cart', require('./controllers/cartController'));
app.use('/api/v1/orders', require('./controllers/ordersController'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
