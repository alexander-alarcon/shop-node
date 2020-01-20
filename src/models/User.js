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

const User = model('User', userSchema);

module.exports = User;
