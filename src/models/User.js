const { model, Schema, Types } = require('mongoose');
const Order = require('./Order');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cart: {
    items: [
      {
        _id: false,
        productId: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

async function addToCart(productId) {
  const { _id, cart } = this;
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
      items: [...items, { productId: Types.ObjectId(productId), quantity: 1 }],
    };
  } else {
    const newQuantity = items[productIndex].quantity + 1;
    updatedCart.items[productIndex] = {
      productId: Types.ObjectId(productId),
      quantity: newQuantity,
    };
  }

  await this.model('User').findByIdAndUpdate(
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

  return this;
}

async function getCart() {
  const user = await this.model('User').findOne({ _id: this._id });
  const productIds = user.cart.items.map((item) => {
    return item.productId;
  });
  const products = await this.model('Product').find({
    _id: {
      $in: productIds,
    },
  });
  return products.map((product) => {
    const { _id: productId, title, price } = product._doc;
    return {
      productId: Types.ObjectId(productId),
      title,
      price,
      quantity: user.cart.items.find((el) => {
        return el.productId.toString() === product.id.toString();
      }).quantity,
    };
  });
}

async function deleteFromCart(productId) {
  const { _id, cart } = this;
  const { items = [] } = cart;
  const newItems = items.filter((el) => {
    return el.productId.toString() !== productId.toString();
  });
  const updatedCart = {
    items: newItems,
  };

  await this.model('User').findByIdAndUpdate(
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

  return this;
}

async function addOrder() {
  const { _id, username, email } = this;
  const cartItems = await this.getCart();
  await Order.create({
    items: cartItems,
    user: {
      userId: Types.ObjectId(_id),
      username,
      email,
    },
  });

  this.cart = { items: [] };
  await this.save();
}

async function getOrders() {
  const { _id } = this;
  const orders = await Order.find({
    'user.userId': Types.ObjectId(_id),
  });

  return orders;
}

userSchema.methods.addToCart = addToCart;
userSchema.methods.getCart = getCart;
userSchema.methods.deleteFromCart = deleteFromCart;
userSchema.methods.addOrder = addOrder;
userSchema.methods.getOrders = getOrders;

const User = model('User', userSchema);

module.exports = User;
