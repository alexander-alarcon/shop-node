const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/isAuth');
const upload = require('../utils/uploadFile');

const {
  getAddProduct,
  getProduct,
  getProducts,
  deleteProduct,
  postAddProduct,
  postEditProduct,
} = require('../controllers/Admin');

const router = express.Router();

/*
  GET /admin/products
*/
router.get('/products', isAuth, getProducts);

/*
  POST /admin/products
*/
router.post(
  '/edit-product',
  isAuth,
  upload.single('image'),
  [
    body('title')
      .trim()
      .isString()
      .isLength({
        min: 3,
      }),
    body('price')
      .trim()
      .isFloat(),
    body('description')
      .trim()
      .isString()
      .isLength({
        min: 10,
        max: 250,
      }),
  ],
  postEditProduct,
);

/*
  GET /admin/products/:productId
*/
router.get('/edit-product/:productId', isAuth, getProduct);

/*
  GET /admin/add-products
  POST /admin/add-products
*/
router
  .route('/add-product')
  .all(isAuth)
  .get(getAddProduct)
  .post(
    upload.single('image'),
    [
      body('title')
        .trim()
        .isString()
        .isLength({
          min: 3,
        }),
      body('price')
        .trim()
        .isFloat(),
      body('description')
        .trim()
        .isString()
        .isLength({
          min: 10,
          max: 250,
        }),
    ],
    postAddProduct,
  );

/*
  POST /admin/delete-product
*/
router.post('/delete-product', isAuth, deleteProduct);

module.exports = router;
