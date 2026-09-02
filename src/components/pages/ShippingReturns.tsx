import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  RotateCcw, 
  Clock, 
  MapPin, 
  Shield,
  CheckCircle,
  AlertCircle,
  Calculator,
  Calendar
} from 'lucide-react';

const ShippingReturns: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns'>('shipping');

  const shippingOptions = [
    {
      name: 'Standard Delivery',
      time: '5-7 Business Days',
      price: 'Free on orders ₹500+',
      description: 'Professional delivery to your door',
      icon: Package
    },
    {
      name: 'White-Glove Delivery',
      time: '3-5 Business Days',
      price: 'Free on orders ₹1,000+',
      description: 'Full setup and assembly included',
      icon: Truck
    },
    {
      name: 'Express Delivery',
      time: '1-2 Business Days',
      price: '₹199',
      description: 'Priority handling and delivery',
      icon: Clock
    }
  ];

  const deliveryZones = [
    { zone: 'Zone 1', states: 'NY, NJ, CT, PA', time: '1-3 days', price: 'Free' },
    { zone: 'Zone 2', states: 'MA, RI, VT, NH, ME, MD, DE, VA, DC', time: '2-4 days', price: '₹99' },
    { zone: 'Zone 3', states: 'All other US states', time: '5-7 days', price: '₹199' }
  ];

  const returnReasons = [
    'Changed my mind',
    'Item damaged during shipping',
    'Item not as described',
    'Wrong item received',
    'Quality issues',
    'Size/fit issues'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Shipping & Returns
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-playfair max-w-3xl mx-auto">
            Everything you need to know about our delivery services and return policy
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-2 shadow-lg">
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'shipping'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shipping Information
              </button>
              <button
                onClick={() => setActiveTab('returns')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'returns'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Returns & Exchanges
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Content */}
      {activeTab === 'shipping' && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            {/* Shipping Options */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center font-montserrat">
                Delivery Options
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {shippingOptions.map((option, index) => (
                  <div key={index} className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">
                      {option.name}
                    </h3>
                    <div className="text-amber-600 font-semibold mb-2">{option.time}</div>
                    <div className="text-2xl font-bold text-gray-900 mb-4">{option.price}</div>
                    <p className="text-gray-600 font-playfair">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Zones */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center font-montserrat">
                Delivery Zones
              </h2>
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Zone</th>
                        <th className="px-6 py-4 text-left font-semibold">States</th>
                        <th className="px-6 py-4 text-left font-semibold">Delivery Time</th>
                        <th className="px-6 py-4 text-left font-semibold">Shipping Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryZones.map((zone, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">{zone.zone}</td>
                          <td className="px-6 py-4 text-gray-600">{zone.states}</td>
                          <td className="px-6 py-4 text-gray-600">{zone.time}</td>
                          <td className="px-6 py-4 font-semibold text-amber-600">{zone.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Shipping Process */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center font-montserrat">
                Our Shipping Process
              </h2>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: '1', title: 'Order Confirmed', desc: 'Your order is confirmed and payment processed' },
                  { step: '2', title: 'Preparation', desc: 'Items are carefully prepared and packaged' },
                  { step: '3', title: 'In Transit', desc: 'Your order is on its way to you' },
                  { step: '4', title: 'Delivered', desc: 'Professional delivery and setup (if selected)' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-montserrat">{item.title}</h3>
                    <p className="text-gray-600 font-playfair">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Services */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  White-Glove Service Includes
                </h3>
                <ul className="space-y-3">
                  {[
                    'Professional delivery team',
                    'Complete assembly and setup',
                    'Placement in your desired room',
                    'Packaging removal and disposal',
                    'Basic furniture positioning'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-600 font-playfair">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Delivery Requirements
                </h3>
                <ul className="space-y-3">
                  {[
                    'Someone 18+ must be present',
                    'Clear path to delivery location',
                    'Adequate space for maneuvering',
                    'Elevator access if applicable',
                    'Special access arrangements if needed'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <span className="text-gray-600 font-playfair">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Returns Content */}
      {activeTab === 'returns' && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            {/* Return Policy Overview */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center font-montserrat">
                30-Day Return Policy
              </h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">30 Days</h3>
                  <p className="text-gray-600">From delivery date</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Free Returns</h3>
                  <p className="text-gray-600">On most items</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <RotateCcw className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Process</h3>
                  <p className="text-gray-600">Simple online returns</p>
                </div>
              </div>
            </div>

            {/* Return Process */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center font-montserrat">
                How to Return an Item
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: '1', title: 'Start Return', desc: 'Log into your account and select the item to return' },
                  { step: '2', title: 'Schedule Pickup', desc: 'We\'ll arrange free pickup from your location' },
                  { step: '3', title: 'Get Refund', desc: 'Receive your refund within 5-7 business days' }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-3xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-montserrat">{item.title}</h3>
                    <p className="text-gray-600 font-playfair">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Conditions */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Return Conditions
                </h3>
                <ul className="space-y-3">
                  {[
                    'Items must be in original condition',
                    'All original packaging included',
                    'No signs of wear or damage',
                    'Assembly instructions and hardware included',
                    'Return within 30 days of delivery'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-600 font-playfair">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                  Non-Returnable Items
                </h3>
                <ul className="space-y-3">
                  {[
                    'Custom or personalized furniture',
                    'Items damaged by customer',
                    'Mattresses and bedding',
                    'Final sale items',
                    'Items returned after 30 days'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-gray-600 font-playfair">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Start Return */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center font-montserrat">
                Need to Return Something?
              </h3>
              <p className="text-gray-600 text-center mb-6 font-playfair">
                Start your return process online or contact our customer service team for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300">
                  Start Return Online
                </button>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-semibold border-2 border-gray-200 hover:border-amber-500 transition-all duration-300">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ShippingReturns;
