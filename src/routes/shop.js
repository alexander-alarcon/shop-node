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
  POST /shop/create-order
*/
router.post('/create-order', isAuth, postOrders);

/*
  GET /shop/:productId
*/
router.get('/:productId', getProduct);

module.exports = router;
