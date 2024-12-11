const { Router } = require('express');
const router = Router();

const productRouter = require('./product.routes');
const authRouter = require('./auth.routes');

router.use('/products', productRouter);
router.use('/users', authRouter);
// router.use('/carts', cartRouter);

module.exports = router;