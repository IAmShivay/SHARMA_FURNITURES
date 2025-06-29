import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Truck, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone,
  Download,
  ArrowRight,
  Package
} from 'lucide-react';

interface Order {
  id: string;
  items: any[];
  shipping: any;
  payment: any;
  totals: any;
  status: string;
  deliveryOption: string;
  createdAt: string;
  estimatedDelivery: string;
}

const CheckoutSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Get order from localStorage (in real app, this would be fetched from API)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link to="/" className="text-amber-600 hover:text-amber-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const estimatedDeliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <div className="container mx-auto px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2 font-playfair">
            Thank you for your purchase, {order.shipping.firstName}!
          </p>
          <p className="text-gray-600">
            Your order <span className="font-semibold text-amber-600">{order.id}</span> has been confirmed and is being processed.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat flex items-center">
                <Truck className="w-6 h-6 mr-3 text-amber-600" />
                Delivery Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                      <p>{order.shipping.address}</p>
                      <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                      <p>{order.shipping.country}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <div className="text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{order.shipping.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{order.shipping.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Delivery Method</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">
                          {order.deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}
                        </span>
                      </div>
                      <p className="text-amber-700 text-sm">
                        {order.deliveryOption === 'express' 
                          ? 'Priority delivery with white-glove setup (2-3 days)'
                          : 'White-glove delivery and setup included (5-7 days)'
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{estimatedDeliveryDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat">
                Order Items
              </h2>
              
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                      
                      {item.customization && (
                        <div className="text-sm text-gray-600 space-y-1 mb-2">
                          {item.customization.color && (
                            <p>Color: {item.customization.color}</p>
                          )}
                          {item.customization.woodType && (
                            <p>Wood: {item.customization.woodType}</p>
                          )}
                          {item.customization.finish && (
                            <p>Finish: {item.customization.finish}</p>
                          )}
                        </div>
                      )}
                      
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat">
                What Happens Next?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Processing</h3>
                    <p className="text-gray-600">We'll prepare your items and schedule delivery within 24 hours.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery Coordination</h3>
                    <p className="text-gray-600">Our delivery team will contact you to schedule a convenient time.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">White-Glove Delivery</h3>
                    <p className="text-gray-600">Professional delivery and setup in your desired room.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-montserrat">
                Order Summary
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.totals.shipping === 0 ? 'FREE' : `$${order.totals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <p>Payment Method: •••• {order.payment.last4}</p>
                <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              
              <button className="w-full flex items-center justify-center space-x-2 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
              
              <Link
                to="/account/orders"
                className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>Track Order</span>
              </Link>
              
              <Link
                to="/"
                className="w-full flex items-center justify-center space-x-2 text-amber-600 py-3 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Support */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our customer service team is here to help with any questions about your order.
              </p>
              <Link
                to="/contact"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
