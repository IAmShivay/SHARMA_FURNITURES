import mongoose, { Schema } from 'mongoose';

export interface IConsultation {
  user: mongoose.Types.ObjectId;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  consultationDate: string;
  consultationTime: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['pending', 'paid', 'completed', 'cancelled'], default: 'pending' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    consultationDate: { type: String, required: true },
    consultationTime: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

ConsultationSchema.index({ user: 1, createdAt: -1 });
ConsultationSchema.index({ status: 1 });

const Consultation = mongoose.model<IConsultation>('Consultation', ConsultationSchema);
export default Consultation;
