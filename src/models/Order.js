const { model, Schema, Types } = require('mongoose');

const orderSchema = new Schema({
  items: [
    {
      _id: false,
      productId: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  user: {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
});

const Order = model('Order', orderSchema);

module.exports = Order;
