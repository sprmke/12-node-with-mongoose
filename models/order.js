const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      productData: { type: Object, required: true },
      quantity: { type: Number, requried: true },
    },
  ],
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      requried: true,
      ref: 'User',
    },
  },
});

module.exports = mongoose.model('Order', orderSchema);
