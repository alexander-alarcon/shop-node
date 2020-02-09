const { model, Schema, Types } = require('mongoose');

const Product = require('./Product');

const orderSchema = new Schema({
  items: [
    {
      product: Product.schema,
      quantity: {
        type: Number,
        required: true,
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
