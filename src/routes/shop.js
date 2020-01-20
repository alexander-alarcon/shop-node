const express = require('express');

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
  //   .get(getCart)
  .post(postAddCart);

// /*
//   POST /shop/cart-delete-item
// */
// router.post('/cart-delete-item', postDeleteCart);

// /*
//   GET /shop/orders
// */
// router.get('/orders', getOrders);

// /*
//   POST /shop/create-order
// */
// router.post('/create-order', postOrders);

/*
  GET /shop/:productId
*/
router.get('/:productId', getProduct);

module.exports = router;
