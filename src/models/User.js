const uniqueValidator = require('mongoose-unique-validator');
const { model, Schema, Types } = require('mongoose');
const bcrypt = require('bcrypt');

const Order = require('./Order');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiration: {
    type: Date,
    required: false,
  },
  password: {
    type: String,
    required: true,
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
  const { _id, email } = this;
  const cart = await this.getCart();
  const cartItems = cart.map((el) => {
    return { quantity: el.quantity, product: { ...el.productId._doc } };
  });
  await Order.create({
    items: cartItems,
    user: {
      userId: Types.ObjectId(_id),
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

userSchema.plugin(uniqueValidator, {
  message: 'Email already taken',
});

userSchema.pre('save', async function() {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = +process.env.SALT_ROUNDS;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
  }
});

userSchema.methods.addToCart = addToCart;
userSchema.methods.getCart = getCart;
userSchema.methods.deleteFromCart = deleteFromCart;
userSchema.methods.addOrder = addOrder;
userSchema.methods.getOrders = getOrders;

const User = model('User', userSchema);

module.exports = User;
