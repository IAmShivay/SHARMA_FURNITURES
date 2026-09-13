import React from 'react';
import { RefreshCw, Clock, CreditCard, AlertTriangle, CheckCircle, Package, Mail, Phone } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead
        title="Refund Policy | LuxeHome"
        description="Read LuxeHome's refund policy. Learn about our 30-day refund guarantee, eligibility, process, and timelines for furniture purchases."
      />

      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <RefreshCw className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Refund Policy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to love your LuxeHome furniture. If something isn't right, we'll make it right.
          </p>
          <div className="text-sm text-gray-500 mt-4">Last updated: September 1, 2026</div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">

            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our 30-Day Refund Guarantee</h2>
              <p className="text-gray-600 text-lg mb-4">
                At LuxeHome, customer satisfaction is our top priority. If you are not completely satisfied with your purchase,
                you may request a refund within <strong>30 calendar days</strong> from the date of delivery.
              </p>
              <p className="text-gray-600 text-lg">
                We aim to process every eligible refund promptly and fairly. Please review the conditions below to understand
                what qualifies and how the process works.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Eligible for Refund</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Item received is damaged, defective, or significantly different from the product listing',
                  'Item arrives with missing parts or hardware that cannot be replaced',
                  'Wrong item delivered (different product, size, or color than ordered)',
                  'Custom order does not match the specifications confirmed at the time of purchase',
                  'Item has a manufacturing defect discovered within 30 days of delivery',
                  'Unused, unassembled items returned in original packaging within 30 days',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Not Eligible for Refund</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Items that have been assembled, used, or show signs of wear',
                  'Items returned after the 30-day window has passed',
                  'Items damaged due to misuse, negligence, or improper care by the customer',
                  'Clearance or final-sale items (marked as non-returnable at checkout)',
                  'Fabric swatches, samples, or gift cards',
                  'Items without original packaging, tags, or accessories',
                  'Design consultation fees after the consultation has been conducted',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Refund Process</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Contact Us', desc: 'Email returns@luxehome.com or call us with your order number and reason for return.' },
                  { step: '2', title: 'Get Approval', desc: 'Our team reviews your request within 2 business days and provides a Return Authorization.' },
                  { step: '3', title: 'Ship It Back', desc: 'Pack the item securely in original packaging. We provide a prepaid shipping label for defective items.' },
                  { step: '4', title: 'Receive Refund', desc: 'Once we receive and inspect the item, your refund is processed within 5–10 business days.' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                      {item.step}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900">Refund Methods</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li><strong>Original payment method:</strong> Credit/debit card refunds take 5–10 business days to appear on your statement.</li>
                  <li><strong>Store credit:</strong> Available immediately upon approval. Includes a 10% bonus credit as a goodwill gesture.</li>
                  <li><strong>Bank transfer:</strong> For orders paid via bank transfer, refunds are processed within 7–14 business days.</li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900">Timelines</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li><strong>Return window:</strong> 30 days from delivery date.</li>
                  <li><strong>Approval time:</strong> 1–2 business days after request.</li>
                  <li><strong>Inspection:</strong> 2–3 business days after we receive the item.</li>
                  <li><strong>Refund processing:</strong> 5–10 business days after inspection.</li>
                  <li><strong>Custom orders:</strong> May require up to 15 business days for evaluation.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipping Costs for Returns</h3>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>Defective or wrong items:</strong> LuxeHome covers the full cost of return shipping. We will arrange a pickup or provide a prepaid label.
                </p>
                <p>
                  <strong>Change of mind:</strong> The customer is responsible for return shipping costs. For large furniture items, a flat return shipping fee of ₹149 applies (standard delivery zones). White-glove pickup is available for ₹249.
                </p>
                <p>
                  <strong>Free returns:</strong> Orders above ₹2,000 qualify for free returns regardless of reason (excluding custom orders).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h3>
              <p className="text-gray-600 mb-3">
                We are happy to exchange items for a different size, color, or model subject to availability. Exchanges follow the same 30-day window. If the replacement item is a different price, the difference is charged or refunded accordingly.
              </p>
              <p className="text-gray-600">
                To request an exchange, contact us at <strong>returns@luxehome.com</strong> with your order number and the item you'd like instead.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help with a Return?</h3>
              <p className="text-gray-600 mb-6">
                Our customer service team is here to make the process as smooth as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <span>returns@luxehome.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Phone className="w-5 h-5 text-amber-600" />
                  <span>+91 9547587246</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
