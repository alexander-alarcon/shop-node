const { model, Schema, Types } = require('mongoose');

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
          ref: 'User',
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

userSchema.methods.addToCart = addToCart;

const User = model('User', userSchema);

module.exports = User;
