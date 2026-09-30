import mongoose, { Schema } from 'mongoose';

export interface IInvoiceItem {
  name: string;
  description?: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface IInvoice {
  invoiceNumber: string;
  order?: mongoose.Types.ObjectId;
  type: 'standard' | 'proforma' | 'credit_note';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

  // Seller
  sellerName: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerGstin?: string;
  sellerPan?: string;
  sellerLogo?: string;

  // Buyer
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerGstin?: string;

  // Items
  items: IInvoiceItem[];

  // Amounts
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  shipping: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
  currency: string;

  // Payment
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paidAmount: number;
  dueDate?: Date;
  paidAt?: Date;
  transactionId?: string;

  // Cashfree
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;
  paymentSessionId?: string;
  paymentLink?: string;

  // Notes
  notes?: string;
  termsAndConditions?: string;
  placeOfSupply?: string;

  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  name: { type: String, required: true },
  description: String,
  hsnCode: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 18 },
  taxAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { _id: false });

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: { type: String, required: true, unique: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  type: { type: String, enum: ['standard', 'proforma', 'credit_note'], default: 'standard' },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },

  sellerName: { type: String, required: true },
  sellerAddress: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  sellerGstin: String,
  sellerPan: String,
  sellerLogo: String,

  buyerName: { type: String, required: true },
  buyerAddress: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerGstin: String,

  items: [InvoiceItemSchema],

  subtotal: { type: Number, required: true },
  discountTotal: { type: Number, default: 0 },
  taxableAmount: { type: Number, required: true },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  amountInWords: { type: String, required: true },
  currency: { type: String, default: 'INR' },

  paymentMethod: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial', 'refunded'], default: 'pending' },
  paidAmount: { type: Number, default: 0 },
  dueDate: Date,
  paidAt: Date,
  transactionId: String,

  cashfreeOrderId: String,
  cashfreePaymentId: String,
  paymentSessionId: String,
  paymentLink: String,

  notes: String,
  termsAndConditions: { type: String, default: 'Payment is due within 15 days. Late payments may incur additional charges.' },
  placeOfSupply: String,

  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ status: 1, createdAt: -1 });
InvoiceSchema.index({ buyerEmail: 1 });
InvoiceSchema.index({ cashfreeOrderId: 1 });

InvoiceSchema.pre('validate', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    this.invoiceNumber = `INV-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
export default Invoice;
