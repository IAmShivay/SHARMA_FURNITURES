import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { auth, hasPermission } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Consultation from '../models/Consultation';
import cashfree from '../config/cashfree';

const router = Router();

const CONSULTATION_PLANS = [
  { id: 'virtual-basic', name: 'Virtual Consultation', duration: '30 min', price: 499, currency: 'INR' },
  { id: 'virtual-premium', name: 'Premium Virtual', duration: '60 min', price: 999, currency: 'INR' },
  { id: 'in-store', name: 'In-Store Visit', duration: '90 min', price: 1499, currency: 'INR' },
  { id: 'site-visit', name: 'Home / Office Visit', duration: '2-3 hours', price: 2999, currency: 'INR' },
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

    const orderId = `consult_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const orderRequest = {
      order_amount: plan.price,
      order_currency: plan.currency,
      order_id: orderId,
      customer_details: {
        customer_id: (req as any).user._id.toString(),
        customer_name: name,
        customer_email: email,
        customer_phone: phone.replace(/\D/g, '').slice(-10),
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/consultation?order_id=${orderId}&status={order_status}`,
        notify_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/consultation/webhook`,
      },
      order_note: `${plan.name} - ${plan.duration} | ${date} ${time}`,
    };

    const response = await (cashfree as any).PGCreateOrder("2023-08-01", orderRequest);
    const orderData = response.data;

    await Consultation.create({
      user: (req as any).user._id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      cashfreeOrderId: orderId,
      paymentSessionId: orderData.payment_session_id,
      status: 'pending',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      consultationDate: date,
      consultationTime: time,
      notes: notes || '',
    });

    res.json({
      success: true,
      data: {
        orderId,
        paymentSessionId: orderData.payment_session_id,
        amount: plan.price,
        currency: plan.currency,
        plan,
      },
    });
  })
);

router.post(
  '/verify-payment',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.body;
    if (!orderId) throw new AppError('Order ID required', 400);

    const response = await (cashfree as any).PGOrderFetchPayments("2023-08-01", orderId);
    const payments = response.data;

    if (!payments || payments.length === 0) throw new AppError('No payments found for this order', 400);

    const successfulPayment = (payments as any[]).find((p: any) => p.payment_status === 'SUCCESS');
    if (!successfulPayment) throw new AppError('Payment not successful', 400);

    await Consultation.findOneAndUpdate(
      { cashfreeOrderId: orderId },
      { status: 'paid', cashfreePaymentId: successfulPayment.cf_payment_id }
    );

    res.json({
      success: true,
      message: 'Payment verified. Consultation booked!',
      data: { paymentId: successfulPayment.cf_payment_id, orderId },
    });
  })
);

router.post(
  '/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['x-cashfree-signature'] as string;
    const timestamp = req.headers['x-cashfree-timestamp'] as string;
    const rawBody = JSON.stringify(req.body);

    if (process.env.CASHFREE_SECRET_KEY && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
        .update(timestamp + rawBody)
        .digest('base64');

      if (signature !== expectedSignature) {
        return res.status(401).json({ success: false, message: 'Invalid signature' });
      }
    }

    const { data, type } = req.body;

    if (type === 'PAYMENT_SUCCESS_WEBHOOK' || data?.payment?.payment_status === 'SUCCESS') {
      const orderId = data?.order?.order_id;
      const paymentId = data?.payment?.cf_payment_id;

      if (orderId) {
        await Consultation.findOneAndUpdate(
          { cashfreeOrderId: orderId },
          { status: 'paid', cashfreePaymentId: paymentId }
        );
      }
    }

    res.json({ success: true });
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
