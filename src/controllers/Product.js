const debug = require('debug')('shop-sequelize:ProductController');
const { Types } = require('mongoose');

const Product = require('../models/Product');
const User = require('../models/User');

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
}; */

exports.postAddCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { _id, cart } = req.user;
    const { items = [] } = cart;
    let updatedCart = {
      ...cart,
      items: [...items],
    };
    const productIndex = items.findIndex((el) => {
      return el.productId.toString() === productId;
    });
    if (productIndex === -1) {
      updatedCart = {
        ...cart,
        items: [
          ...items,
          { productId: Types.ObjectId(productId), quantity: 1 },
        ],
      };
    } else {
      const newQuantity = items[productIndex].quantity + 1;
      updatedCart.items[productIndex] = {
        productId: Types.ObjectId(productId),
        quantity: newQuantity,
      };
    }

    await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          cart: updatedCart,
        },
      },
      {
        new: true,
      },
    );
    return res.redirect('/shop');
  } catch (error) {
    // debug(error);
    return next(error);
  }
};

/* exports.postDeleteCart = async (req, res, next) => {
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
