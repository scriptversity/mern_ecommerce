const { Router } = require('express');
const router = Router();

const productRouter = require('./product.routes');
// const userRouter = require('./user.routes');
// const cartRouter = require('./cart.routes');

router.use('/products', productRouter);
// router.use('/users', userRouter);
// router.use('/carts', cartRouter);

module.exports = router;