const debug = require('debug')('shop-sequelize:ProductController');

const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isArchived: false });
    return res.render('shop/index', {
      docTitle: 'admin/products',
      path: '/',
      products,
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
    console.log({ product, yolo: 'yolo' });
    if (product) {
      return res.render('shop/product-detail', {
        docTitle: 'Shop',
        path: '/shop',
        product,
      });
    }

    return next();
  } catch (error) {
    debug(error);
    return next(error);
  }
};

/* exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    return res.render('shop/cart', {
      docTitle: 'Cart',
      path: '/cart',
      products,
    });
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postAddCart = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    let product;
    const { productId } = req.body;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });
    let newQuantity = 1;
    if (products.length > 0) {
      [product] = products;
    }
    if (product) {
      const oldQuantity = product.CartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      product = await Product.findByPk(productId);
    }
    await cart.addProduct(product, { through: { quantity: newQuantity } });
    await transaction.commit();
    return res.redirect('/shop/cart');
  } catch (error) {
    debug(error);
    transaction.rollback();
    return next(error);
  }
};

exports.postDeleteCart = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    let product;
    const { productId } = req.body;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });
    if (products.length > 0) {
      [product] = products;
      await product.CartItem.destroy();
    }
    await transaction.commit();
    return res.redirect('/shop/cart');
  } catch (error) {
    debug(error);
    await transaction.rollback();
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ['Products'] });
    return res.render('shop/order', {
      docTitle: 'Orders',
      path: '/shop/orders',
      orders,
    });
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postOrders = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(
      products.map((product) => {
        product.OrderItem = { quantity: product.CartItem.quantity };
        return product;
      }),
    );
    await cart.setProducts(null);
    await transaction.commit();
    return res.redirect('/shop/orders');
  } catch (error) {
    debug(error);
    await transaction.rollback();
    return next(error);
  }
};
 */
