import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { auth, hasPermission } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Consultation from '../models/Consultation';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const CONSULTATION_PLANS = [
  { id: 'virtual-basic', name: 'Virtual Consultation', duration: '30 min', price: 49900, currency: 'INR' },
  { id: 'virtual-premium', name: 'Premium Virtual', duration: '60 min', price: 99900, currency: 'INR' },
  { id: 'in-store', name: 'In-Store Visit', duration: '90 min', price: 149900, currency: 'INR' },
  { id: 'site-visit', name: 'Home / Office Visit', duration: '2-3 hours', price: 299900, currency: 'INR' },
];

router.get('/plans', (_req: Request, res: Response) => {
  res.json({ success: true, data: CONSULTATION_PLANS });
});

router.post(
  '/create-order',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const { planId, name, email, phone, date, time, notes } = req.body;

    const plan = CONSULTATION_PLANS.find((p) => p.id === planId);
    if (!plan) throw new AppError('Invalid consultation plan', 400);
    if (!name || !email || !phone || !date || !time) throw new AppError('Name, email, phone, date and time are required', 400);

    const order = await razorpay.orders.create({
      amount: plan.price,
      currency: plan.currency,
      receipt: `consult_${Date.now()}`,
      notes: { planId: plan.id, planName: plan.name, customerName: name, customerEmail: email, customerPhone: phone, consultationDate: date, consultationTime: time, additionalNotes: notes || '' },
    });

    await Consultation.create({
      user: (req as any).user._id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      razorpayOrderId: order.id,
      status: 'pending',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      consultationDate: date,
      consultationTime: time,
      notes: notes || '',
    });

    res.json({ success: true, data: { orderId: order.id, amount: order.amount, currency: order.currency, plan } });
  })
);

router.post(
  '/verify-payment',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) throw new AppError('Missing payment verification fields', 400);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) throw new AppError('Payment verification failed', 400);

    await Consultation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: 'paid', razorpayPaymentId: razorpay_payment_id }
    );

    res.json({ success: true, message: 'Payment verified. Consultation booked!', data: { paymentId: razorpay_payment_id, orderId: razorpay_order_id } });
  })
);

router.get(
  '/bookings',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, status } = req.query;
    const query: any = {};
    if (status) query.status = status;

    const bookings = await Consultation.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Consultation.countDocuments(query);

    res.json({ success: true, data: { bookings, pagination: { current: Number(page), pages: Math.ceil(total / Number(limit)), total } } });
  })
);

router.put(
  '/bookings/:id/status',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const booking = await Consultation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) throw new AppError('Booking not found', 404);
    res.json({ success: true, data: booking });
  })
);

export default router;
