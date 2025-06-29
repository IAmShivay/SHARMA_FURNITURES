const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  customization: {
    woodType: String,
    finish: String,
    color: String,
    assembly: String,
    hardware: [String],
    protection: String,
    customizationCost: {
      type: Number,
      default: 0
    }
  },
  sku: String,
  variant: String
});

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'United States'
  },
  phone: String,
  instructions: String
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'financing'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentIntentId: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paidAt: Date,
  refundedAt: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  processingFee: {
    type: Number,
    default: 0
  }
});

const shippingSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['standard', 'express', 'white_glove', 'freight', 'pickup'],
    required: true
  },
  cost: {
    type: Number,
    required: true,
    default: 0
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  trackingNumber: String,
  carrier: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: 'pending'
  },
  updates: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String
  }]
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  shipping: shippingSchema,
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping']
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: [
      'pending',           // Order created, payment pending
      'confirmed',         // Payment confirmed, processing
      'processing',        // Items being prepared
      'ready_to_ship',     // Ready for shipment
      'shipped',           // Order shipped
      'delivered',         // Order delivered
      'completed',         // Order completed successfully
      'cancelled',         // Order cancelled
      'refunded',          // Order refunded
      'returned',          // Order returned
      'disputed'           // Order disputed
    ],
    default: 'pending'
  },
  payment: paymentSchema,
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema,
  notes: String,
  internalNotes: String,
  customerService: [{
    type: {
      type: String,
      enum: ['inquiry', 'complaint', 'request', 'feedback']
    },
    subject: String,
    message: String,
    response: String,
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  estimatedDelivery: Date,
  actualDelivery: Date,
  returnWindow: Date,
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'store', 'marketplace'],
    default: 'website'
  },
  referrer: String,
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'shipping.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const customizationCost = item.customization?.customizationCost || 0;
    return sum + itemTotal + customizationCost;
  }, 0);

  // Calculate total
  this.total = this.subtotal + this.tax + this.shipping.cost - this.discount.amount;
  
  next();
});

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function(status, description, updatedBy) {
  this.timeline.push({
    status,
    description,
    updatedBy
  });
  
  this.status = status;
  return this.save();
};

// Method to update shipping status
orderSchema.methods.updateShippingStatus = function(status, location, description) {
  this.shipping.status = status;
  this.shipping.updates.push({
    status,
    location,
    description
  });
  
  if (status === 'delivered') {
    this.shipping.actualDelivery = new Date();
    this.actualDelivery = new Date();
    this.status = 'delivered';
    
    // Set return window (30 days from delivery)
    this.returnWindow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  return this.save();
};

// Method to process payment
orderSchema.methods.processPayment = function(transactionId, paymentIntentId) {
  this.payment.status = 'completed';
  this.payment.transactionId = transactionId;
  this.payment.paymentIntentId = paymentIntentId;
  this.payment.paidAt = new Date();
  
  this.status = 'confirmed';
  
  return this.addTimelineEntry('confirmed', 'Payment confirmed', null);
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  if (['shipped', 'delivered', 'completed'].includes(this.status)) {
    throw new Error('Cannot cancel order that has been shipped or delivered');
  }
  
  this.status = 'cancelled';
  
  return this.addTimelineEntry('cancelled', `Order cancelled: ${reason}`, cancelledBy);
};

// Method to process refund
orderSchema.methods.processRefund = function(amount, reason, processedBy) {
  if (amount > this.total) {
    throw new Error('Refund amount cannot exceed order total');
  }
  
  this.payment.refundAmount += amount;
  this.payment.refundedAt = new Date();
  
  if (this.payment.refundAmount >= this.total) {
    this.payment.status = 'refunded';
    this.status = 'refunded';
  } else {
    this.payment.status = 'partially_refunded';
  }
  
  return this.addTimelineEntry(this.status, `Refund processed: $${amount} - ${reason}`, processedBy);
};

// Method to add customer service inquiry
orderSchema.methods.addCustomerServiceInquiry = function(type, subject, message, priority = 'medium') {
  this.customerService.push({
    type,
    subject,
    message,
    priority
  });
  
  return this.save();
};

// Method to respond to customer service inquiry
orderSchema.methods.respondToInquiry = function(inquiryId, response, respondedBy, status = 'resolved') {
  const inquiry = this.customerService.id(inquiryId);
  if (!inquiry) {
    throw new Error('Inquiry not found');
  }
  
  inquiry.response = response;
  inquiry.status = status;
  inquiry.assignedTo = respondedBy;
  inquiry.updatedAt = new Date();
  
  return this.save();
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        completedOrders: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        cancelledOrders: {
          $sum: {
            $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
          }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };
};

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

// Virtual for can be returned
orderSchema.virtual('canBeReturned').get(function() {
  return this.status === 'delivered' && 
         this.returnWindow && 
         new Date() <= this.returnWindow;
});

module.exports = mongoose.model('Order', orderSchema);
