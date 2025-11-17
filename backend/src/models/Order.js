const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'FoodItem',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true }, // in dollars
    type: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: true,
    },
    deliveryDetails: {
      phone: { type: String },
      address: { type: String },
      notes: { type: String },
      allergies: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'preparing', 'completed', 'cancelled'],
      default: 'pending',
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      default: null,
    },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
