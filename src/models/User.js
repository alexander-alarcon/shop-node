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
  const { cart } = this;
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

  this.cart = updatedCart;
  await this.save();

  return this;
}

async function getCart() {
  const { _id } = this;
  const user = await this.model('User')
    .findById(_id)
    .populate('cart.items.productId');
  return user.cart.items;
}

async function deleteFromCart(productId) {
  const { cart } = this;
  const { items = [] } = cart;
  const newItems = items.filter((el) => {
    return el.productId.toString() !== productId.toString();
  });

  this.cart.items = newItems;
  await this.save();

  return this;
}

async function addOrder() {
  const { _id, username, email } = this;
  const cart = await this.getCart();
  const cartItems = cart.map((el) => {
    return { quantity: el.quantity, product: { ...el.productId._doc } };
  });
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
  }).populate('items.productId');

  return orders;
}

userSchema.methods.addToCart = addToCart;
userSchema.methods.getCart = getCart;
userSchema.methods.deleteFromCart = deleteFromCart;
userSchema.methods.addOrder = addOrder;
userSchema.methods.getOrders = getOrders;

const User = model('User', userSchema);

module.exports = User;
