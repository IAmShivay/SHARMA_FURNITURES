import { Router, Request, Response } from 'express';
import { auth, hasPermission } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Invoice from '../models/Invoice';
import cashfree from '../config/cashfree';

const router = Router();

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}

function amountToWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = 'Rupees ' + numberToWords(rupees);
  if (paise > 0) result += ' and ' + numberToWords(paise) + ' Paise';
  return result + ' Only';
}

router.get(
  '/',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, status, search } = req.query;
    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: {
        invoices,
        pagination: { current: Number(page), pages: Math.ceil(total / Number(limit)), total },
      },
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const invoice = await Invoice.findById(req.params.id).populate('order').populate('createdBy', 'name email');
    if (!invoice) throw new AppError('Invoice not found', 404);
    res.json({ success: true, data: invoice });
  })
);

router.post(
  '/',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    let subtotal = 0;
    let discountTotal = 0;
    let totalTax = 0;

    const items = data.items.map((item: any) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const discountAmount = (itemSubtotal * (item.discount || 0)) / 100;
      const taxableAmount = itemSubtotal - discountAmount;
      const taxAmount = (taxableAmount * (item.taxRate || 18)) / 100;
      const total = taxableAmount + taxAmount;

      subtotal += itemSubtotal;
      discountTotal += discountAmount;
      totalTax += taxAmount;

      return { ...item, taxAmount, total };
    });

    const taxableAmount = subtotal - discountTotal;
    const isIntraState = !data.igst || data.igst === 0;
    const cgst = isIntraState ? totalTax / 2 : 0;
    const sgst = isIntraState ? totalTax / 2 : 0;
    const igst = isIntraState ? 0 : totalTax;
    const shipping = data.shipping || 0;
    const rawTotal = taxableAmount + totalTax + shipping;
    const roundOff = Math.round(rawTotal) - rawTotal;
    const grandTotal = Math.round(rawTotal);

    const invoice = await Invoice.create({
      ...data,
      items,
      subtotal,
      discountTotal,
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalTax,
      shipping,
      roundOff: Math.round(roundOff * 100) / 100,
      grandTotal,
      amountInWords: amountToWords(grandTotal),
      createdBy: (req as any).user._id,
    });

    res.status(201).json({ success: true, data: invoice });
  })
);

router.put(
  '/:id',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) throw new AppError('Invoice not found', 404);
    res.json({ success: true, data: invoice });
  })
);

router.delete(
  '/:id',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) throw new AppError('Invoice not found', 404);
    res.json({ success: true, message: 'Invoice deleted' });
  })
);

router.post(
  '/:id/create-payment',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) throw new AppError('Invoice not found', 404);
    if (invoice.paymentStatus === 'paid') throw new AppError('Invoice already paid', 400);

    const orderId = `inv_${invoice.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;

    const orderRequest = {
      order_amount: invoice.grandTotal,
      order_currency: invoice.currency,
      order_id: orderId,
      customer_details: {
        customer_id: invoice.buyerEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
        customer_name: invoice.buyerName,
        customer_email: invoice.buyerEmail,
        customer_phone: invoice.buyerPhone.replace(/\D/g, '').slice(-10) || '9999999999',
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invoice/${invoice._id}?status={order_status}`,
        notify_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/invoice/webhook`,
      },
      order_note: `Invoice ${invoice.invoiceNumber}`,
    };

    const response = await (cashfree as any).PGCreateOrder("2023-08-01", orderRequest);
    const orderData = response.data;

    invoice.cashfreeOrderId = orderId;
    invoice.paymentSessionId = orderData.payment_session_id;
    invoice.paymentLink = orderData.payment_link || '';
    await invoice.save();

    res.json({
      success: true,
      data: {
        orderId,
        paymentSessionId: orderData.payment_session_id,
        paymentLink: orderData.payment_link,
        amount: invoice.grandTotal,
      },
    });
  })
);

router.post(
  '/:id/mark-paid',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const { transactionId, paymentMethod } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: 'paid',
        paidAmount: undefined,
        paidAt: new Date(),
        status: 'paid',
        transactionId: transactionId || 'manual',
        paymentMethod: paymentMethod || 'bank_transfer',
      },
      { new: true }
    );
    if (!invoice) throw new AppError('Invoice not found', 404);

    invoice.paidAmount = invoice.grandTotal;
    await invoice.save();

    res.json({ success: true, data: invoice });
  })
);

router.post(
  '/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    const { data } = req.body;

    if (data?.payment?.payment_status === 'SUCCESS') {
      const orderId = data?.order?.order_id;
      if (orderId) {
        await Invoice.findOneAndUpdate(
          { cashfreeOrderId: orderId },
          {
            paymentStatus: 'paid',
            status: 'paid',
            paidAt: new Date(),
            cashfreePaymentId: data.payment.cf_payment_id,
            transactionId: data.payment.cf_payment_id,
            paymentMethod: data.payment.payment_group || 'online',
          }
        );
      }
    }

    res.json({ success: true });
  })
);

export default router;
