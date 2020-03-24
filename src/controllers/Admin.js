const debug = require('debug')('shop-mongoose:AdminController');

const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      userId: req.user._id,
      isArchived: false,
    });

    return res.render('admin/index', {
      docTitle: 'Admin Products',
      path: '/admin/products',
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
  const { edit } = req.query;

  try {
    const product = await Product.findOne({
      _id: productId,
      isArchived: false,
    });
    if (product) {
      return res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/products',
        product,
        editing: !!edit,
        isAuthenticated: req.session.isAuthenticated === true,
      });
    }

    return next();
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.getAddProduct = async (req, res, next) => {
  return res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    isAuthenticated: req.session.isAuthenticated === true,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, imageUrl, description } = req.body;
    const { id } = req.user;
    const product = new Product({
      title,
      price: +price,
      imageUrl,
      description,
      userId: id,
    });
    await product.save();
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.body;

  try {
    await Product.findOneAndUpdate(
      {
        _id: productId,
        userId: req.user._id,
      },
      {
        isArchived: true,
      },
    );
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    return nproductIdext(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  try {
    await Product.findOneAndUpdate(
      {
        _id: productId,
        userId: req.user._id,
      },
      {
        title,
        price,
        imageUrl,
        description,
      },
    );
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    return next(error);
  }
};
