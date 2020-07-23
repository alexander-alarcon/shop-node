const debug = require('debug')('shop-mongoose:AdminController');
const { validationResult } = require('express-validator');

const Product = require('../models/Product');

const ITEMS_PER_PAGE = 10;

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const totalItems = await Product.countDocuments({ isArchived: false });
    const products = await Product.find({
      userId: req.user.id,
      isArchived: false,
    })
      .skip((+page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    const success = req.flash('success');

    return res.render('admin/index', {
      docTitle: 'Admin Products',
      path: '/admin/products',
      products,
      isAuthenticated: req.session.isAuthenticated === true,
      success,
      pagination: {
        hasNextPage: ITEMS_PER_PAGE < totalItems,
        hasPrevPage: +page > 1,
        nextPage: +page + 1,
        prevPage: +page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        page,
      },
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

exports.getAddProduct = async (req, res) => {
  return res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    isAuthenticated: req.session.isAuthenticated === true,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description } = req.body;
    const image = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        isAuthenticated: req.session.isAuthenticated === true,
        hasErrors: true,
        product: {
          ...req.body,
        },
        errors: errors.mapped(),
      });
    }
    if (!image) {
      return res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        isAuthenticated: req.session.isAuthenticated === true,
        hasErrors: true,
        product: {
          ...req.body,
        },
        errors: { image: { msg: 'File must be an image' } },
      });
    }
    const { id } = req.user;
    const product = new Product({
      title,
      price: +price,
      imageUrl: req.file.path,
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
        userId: req.user.id,
      },
      {
        isArchived: true,
      },
    );
    req.flash('success', 'Product deleted successfully');
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;

  try {
    const updatedProduct = {
      title,
      price,
      description,
    };

    if (image) {
      updatedProduct.imageUrl = image.path;
    }
    await Product.findOneAndUpdate(
      {
        _id: productId,
        userId: req.user.id,
      },
      updatedProduct,
    );
    req.flash('success', 'Product updated successfully');
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    return next(error);
  }
};
