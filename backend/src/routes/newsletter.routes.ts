import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.json({ success: true, message: 'You are already subscribed!' });
    }

    await Subscriber.create({ email: email.toLowerCase() });
    res.status(201).json({ success: true, message: 'Successfully subscribed to our newsletter!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again.' });
  }
});

export default router;
