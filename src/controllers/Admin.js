const debug = require('debug')('shop-sequelize:AdminController');

// const { Product, sequelize } = require('../models');

/* exports.getProducts = async (req, res, next) => {
  try {
    const products = await req.user.getProducts({
      where: { isArchived: false },
    });

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
    const products = await req.user.getProducts({
      where: { id: productId, isArchived: false },
    });

    if (products.length > 0) {
      return res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/products',
        product: products[0],
        editing: !!edit,
      });
    }

    return next();
  } catch (error) {
    debug(error);
    return next(error);
  }
};
 */
exports.getAddProduct = async (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

/* exports.postAddProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, price, imageUrl, description } = req.body;
    await req.user.createProduct({
      title,
      price,
      imageUrl,
      description,
    });
    //    await Product.create({});
    await transaction.commit();
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    await transaction.rollback();
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    await Product.update({ isArchived: 1 }, { where: { id: +productId } });
    await transaction.commit();
    return res.redirect('/admin/products');
  } catch (error) {
    debug(error);
    await transaction.rollback();
    return next(error);
  }
};
 */
