const debug = require('debug')('shop-sequelize:AdminController');

const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isArchived: false });

    return res.render('admin/index', {
      docTitle: 'Admin Products',
      path: '/admin/products',
      products,
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
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, imageUrl, description } = req.body;
    const { id } = req.user;
    debug(id);
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
    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        isArchived: true,
      },
    );
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  try {
    await Product.findByIdAndUpdate(
      {
        _id: productId,
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
