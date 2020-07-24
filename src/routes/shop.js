const express = require('express');

const isAuth = require('../middleware/isAuth');
const {
  getCart,
  getOrders,
  getProduct,
  getProducts,
  postAddCart,
  postDeleteCart,
  postOrders,
  getInvoice,
  getCheckout,
  postCreatePaymentIntent,
} = require('../controllers/Product');

const router = express.Router();

/*
  GET /shop
*/
router.get('/', getProducts);

/*
  GET /shop/cart
   POST /shop/cart
*/
router
  .route('/cart')
  .all(isAuth)
  .get(getCart)
  .post(postAddCart);

/*
  POST /shop/cart-delete-item
*/
router.post('/cart-delete-item', isAuth, postDeleteCart);

/*
  GET /shop/orders
*/
router.get('/orders', isAuth, getOrders);

/*
  GET /shop/order/:orderId
*/
router.get('/orders/:orderId', isAuth, getInvoice);

/*
  POST /shop/create-order
*/
router.post('/create-order', isAuth, postOrders);

/*
  GET /shop/checkout
*/
router.get('/checkout', isAuth, getCheckout);

/*
  POST /shop/create-payment-intent
*/
router.post('/create-payment-intent', isAuth, postCreatePaymentIntent);

/*
  GET /shop/:productId
*/
router.get('/:productId', getProduct);

module.exports = router;
