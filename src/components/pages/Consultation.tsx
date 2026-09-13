import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, CheckCircle, Star, Phone, Home, Shield, ArrowRight } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import { useAuth } from '../../hooks/useAuth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const plans = [
  {
    id: 'virtual-basic',
    name: 'Virtual Consultation',
    duration: '30 min',
    price: 49900,
    icon: Video,
    tag: 'Quick Advice',
    features: ['Video call with a design expert', 'Room layout suggestions', 'Style & color recommendations', 'Product shortlist (up to 5 items)'],
  },
  {
    id: 'virtual-premium',
    name: 'Premium Virtual',
    duration: '60 min',
    price: 99900,
    icon: Video,
    popular: true,
    tag: 'Best Value',
    features: ['Everything in Basic', 'Full room design mockup', '3D visualization of your layout', 'Unlimited product recommendations', 'Follow-up email with complete summary'],
  },
  {
    id: 'in-store',
    name: 'In-Store Visit',
    duration: '90 min',
    price: 149900,
    icon: MapPin,
    tag: 'Premium',
    features: ['Face-to-face with senior designer', 'Touch & feel fabric/material samples', 'Complete room design plan', 'Custom furniture walkthrough', 'Exclusive in-store pricing'],
  },
  {
    id: 'site-visit',
    name: 'Home / Office Visit',
    duration: '2-3 hours',
    price: 299900,
    icon: Home,
    tag: 'Full Experience',
    features: ['Designer visits your actual space', 'On-site measurements & assessment', 'Real-time layout planning', 'Material & color matching on-site', 'Full design proposal within 48 hrs', 'Includes follow-up virtual session'],
  },
];

const SERVICE_PLAN_MAP: Record<string, string> = {
  'residential': 'virtual-premium',
  'office': 'site-visit',
  'styling': 'virtual-basic',
  'custom': 'in-store',
};

const Consultation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const serviceParam = searchParams.get('service');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(serviceParam ? SERVICE_PLAN_MAP[serviceParam] || null : null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    date: '', time: '', notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login', { state: { from: '/consultation' } }); return; }
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/consultation/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId: selectedPlan, ...form }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const options = {
        key: RAZORPAY_KEY, amount: data.data.amount, currency: data.data.currency,
        name: 'LuxeHome', description: `${data.data.plan.name} - ${data.data.plan.duration}`,
        order_id: data.data.orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch(`${API_URL}/consultation/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) setSuccess(true);
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#D97706' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-lg mx-auto text-center bg-white rounded-3xl shadow-lg p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Consultation Booked!</h2>
            <p className="text-gray-600 mb-2">Confirmed for <strong>{form.date}</strong> at <strong>{form.time}</strong>.</p>
            <p className="text-gray-500 text-sm mb-8">Confirmation sent to {form.email}</p>
            <button onClick={() => navigate('/')} className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activePlan = plans.find(p => p.id === selectedPlan);
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead title="Book a Design Consultation | LuxeHome" description="Book a personalized design consultation with LuxeHome's expert interior designers." />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-white py-16 sm:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">Book a Session</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">
            Design Consultation
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Work one-on-one with our expert designers — virtually, in-store, or at your home
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
            <p className="text-gray-500">Select the consultation type that fits your needs</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200 border-2 ${
                    active ? 'border-amber-500 shadow-lg shadow-amber-100 scale-[1.02]' : 'border-gray-100 hover:border-amber-200 hover:shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> RECOMMENDED
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-amber-100' : 'bg-gray-100'}`}>
                      <plan.icon className={`w-5 h-5 ${active ? 'text-amber-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{plan.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" /> {plan.duration}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">₹{(plan.price / 100).toLocaleString('en-IN')}</span>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-xs text-amber-600 font-medium pl-5">+{plan.features.length - 4} more</li>
                    )}
                  </ul>

                  <div className={`py-2 rounded-lg text-center text-xs font-bold transition-colors ${
                    active ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {active ? '✓ Selected' : 'Select'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Form */}
          {selectedPlan && (
            <div className="max-w-4xl mx-auto mt-14">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-5">
                  {/* Left: Selected plan summary */}
                  <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 sm:p-8">
                    <h3 className="text-lg font-bold mb-1">{activePlan?.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                      <Clock className="w-4 h-4" /> {activePlan?.duration}
                    </div>
                    <div className="text-3xl font-bold mb-6">
                      ₹{((activePlan?.price || 0) / 100).toLocaleString('en-IN')}
                    </div>
                    <ul className="space-y-2.5">
                      {activePlan?.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Shield className="w-3.5 h-3.5 text-amber-400" /> Satisfaction guaranteed
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3.5 h-3.5 text-amber-400" /> Reschedule up to 24hrs before
                      </div>
                    </div>
                  </div>

                  {/* Right: Form */}
                  <div className="md:col-span-3 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-5">Schedule Your Session</h2>
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                          <input type="text" name="name" value={form.name} onChange={handleChange} required
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                          <input type="email" name="email" value={form.email} onChange={handleChange} required
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                          <input type="date" name="date" value={form.date} onChange={handleChange} required min={minDate}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                          <select name="time" value={form.time} onChange={handleChange} required
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                            <option value="">Select</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                            <option value="05:00 PM">05:00 PM</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                          placeholder="Room type, style preferences, specific requirements..."
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" />
                      </div>

                      <label className="flex items-start gap-2 cursor-pointer pt-1">
                        <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                        <span className="text-[11px] text-gray-500 leading-relaxed">
                          I agree to the{' '}
                          <Link to="/terms" target="_blank" className="text-amber-600 hover:underline">Terms</Link>,{' '}
                          <Link to="/privacy" target="_blank" className="text-amber-600 hover:underline">Privacy Policy</Link> &{' '}
                          <Link to="/refund-policy" target="_blank" className="text-amber-600 hover:underline">Refund Policy</Link>.
                          Fees are non-refundable once the session is conducted.
                        </span>
                      </label>

                      <button type="submit" disabled={loading || !agreedToTerms}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3.5 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        ) : (
                          <>Pay ₹{((activePlan?.price || 0) / 100).toLocaleString('en-IN')} & Book</>
                        )}
                      </button>
                      <p className="text-[10px] text-gray-400 text-center">Secured by Razorpay · 256-bit encryption</p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Consultation;
