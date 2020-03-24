const debug = require('debug')('shop-mongoose:ProductController');

const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isArchived: false });
    return res.render('shop/index', {
      docTitle: 'admin/products',
      path: '/',
      products,
      isAuthenticated: req.session.isAuthenticated === true,
    });
  } catch (error) {
    debug('%O', error);
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      _id: productId,
      isArchived: false,
    });

    if (product) {
      return res.render('shop/product-detail', {
        docTitle: 'Shop',
        path: '/shop',
        product,
        isAuthenticated: req.session.isAuthenticated === true,
      });
    }

    return next();
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    return res.render('shop/cart', {
      docTitle: 'Cart',
      path: '/cart',
      products: cart,
      isAuthenticated: req.session.isAuthenticated === true,
    });
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postAddCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await req.user.addToCart(productId);
    return res.redirect('/shop/cart');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postDeleteCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await req.user.deleteFromCart(productId);
    return res.redirect('/shop/cart');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();
    return res.render('shop/order', {
      docTitle: 'Orders',
      path: '/shop/orders',
      orders,
      isAuthenticated: req.session.isAuthenticated === true,
    });
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postOrders = async (req, res, next) => {
  try {
    await req.user.addOrder();
    return res.redirect('/shop/orders');
  } catch (error) {
    debug(error);
    return next(error);
  }
};
