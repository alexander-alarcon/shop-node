const fs = require('fs');
const path = require('path');

const debug = require('debug')('shop-mongoose:ProductController');

const Product = require('../models/Product');
const Order = require('../models/Order');

const createInvoice = require('../utils/generateInvoice');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isArchived: false });
    const success = req.flash('success');
    return res.render('shop/index', {
      docTitle: 'admin/products',
      path: '/',
      products,
      isAuthenticated: req.session.isAuthenticated === true,
      success,
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
    req.flash('success', 'Product added');
    return res.redirect('/shop');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postDeleteCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await req.user.deleteFromCart(productId);
    req.flash('success', 'Product deleted successfully');
    return res.redirect('/shop/cart');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();
    const success = req.flash('success');
    return res.render('shop/order', {
      docTitle: 'Orders',
      path: '/shop/orders',
      orders,
      isAuthenticated: req.session.isAuthenticated === true,
      success,
    });
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postOrders = async (req, res, next) => {
  try {
    await req.user.addOrder();
    req.flash('success', 'Ordered successfully');
    return res.redirect('/shop/orders');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  const { orderId } = req.params;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.resolve('invoices', invoiceName);
  try {
    const order = await Order.findById(orderId).populate(
      'user.userId',
      'firstName lastName',
    );

    if (order.user.userId._id.toString() !== req.user._id.toString()) {
      throw new Error('Unauthorized');
    }
    const doc = createInvoice(order, invoicePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
    doc.pipe(res);
  } catch (error) {
    return next(error);
  }
};
