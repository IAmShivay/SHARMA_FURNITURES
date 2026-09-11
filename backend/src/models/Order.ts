import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types';

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  customization: {
    woodType: String,
    finish: String,
    color: String,
    assembly: String,
    hardware: [String],
    protection: String,
    customizationCost: { type: Number, default: 0 },
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(v: any[]) => v.length > 0, 'Order must have at least one item'],
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shipping: {
      method: {
        type: String,
        enum: ['standard', 'express', 'white_glove', 'freight', 'pickup'],
        default: 'standard',
      },
      cost: { type: Number, default: 0, min: 0 },
      trackingNumber: String,
      carrier: String,
      status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
        default: 'pending',
      },
    },
    discount: {
      amount: { type: Number, default: 0 },
      code: String,
      type: { type: String, enum: ['percentage', 'fixed', 'free_shipping'] },
    },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded', 'returned'],
      default: 'pending',
    },
    payment: {
      method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'],
        default: 'credit_card',
      },
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      paidAt: Date,
    },
    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: 'United States' },
      phone: String,
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        description: String,
        updatedBy: String,
      },
    ],
    estimatedDelivery: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Auto-generate order number
OrderSchema.pre('save', async function (this: IOrder, next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Add id virtual
OrderSchema.methods.toJSON = function () {
  const obj = this.toObject() as any;
  obj.id = obj._id.toString();
  return obj;
};

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
