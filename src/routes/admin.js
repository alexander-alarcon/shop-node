const express = require('express');

const {
  getAddProduct,
  getProduct,
  getProducts,
  deleteProduct,
  postAddProduct,
} = require('../controllers/Admin');

const router = express.Router();

// /*
//   GET /admin/products
// */
// router.get('/products', getProducts);

// /*
//   GET /admin/products/:productId
// */
// router.get('/edit-product/:productId', getProduct);

/*
  POST /admin/add-products
*/
router.route('/add-product').get(getAddProduct);
// .post(postAddProduct);

// /*
//   POST /admin/delete-product
// */
// router.post('/delete-product', deleteProduct);

module.exports = router;
