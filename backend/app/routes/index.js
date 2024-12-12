const { Router } = require('express');
const router = Router();

const productRouter = require('./product.routes');
const authRouter = require('./auth.routes');
const orderRouter = require('./order.routes');

router.use('/products', productRouter);
router.use('/users', authRouter);
router.use('/orders', orderRouter);

module.exports = router;