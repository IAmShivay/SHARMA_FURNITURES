import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar,
  Phone,
  Mail,
  ArrowLeft
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

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<any[]>([]);

  useEffect(() => {
    if (orderId) {
      // Get order from localStorage (in real app, this would be an API call)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      setOrder(foundOrder);

      if (foundOrder) {
        // Generate tracking steps based on order status
        const steps = [
          {
            id: 'confirmed',
            title: 'Order Confirmed',
            description: 'Your order has been received and confirmed',
            icon: <CheckCircle className="w-5 h-5" />,
            completed: true,
            date: foundOrder.createdAt
          },
          {
            id: 'processing',
            title: 'Processing',
            description: 'We are preparing your items for shipment',
            icon: <Package className="w-5 h-5" />,
            completed: ['processing', 'shipped', 'delivered'].includes(foundOrder.status),
            date: foundOrder.status === 'processing' ? new Date().toISOString() : null
          },
          {
            id: 'shipped',
            title: 'Shipped',
            description: 'Your order is on its way to you',
            icon: <Truck className="w-5 h-5" />,
            completed: ['shipped', 'delivered'].includes(foundOrder.status),
            date: foundOrder.status === 'shipped' ? new Date().toISOString() : null
          },
          {
            id: 'delivered',
            title: 'Delivered',
            description: 'Your order has been delivered successfully',
            icon: <CheckCircle className="w-5 h-5" />,
            completed: foundOrder.status === 'delivered',
            date: foundOrder.status === 'delivered' ? new Date().toISOString() : null
          }
        ];
        setTrackingSteps(steps);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find an order with that ID.</p>
          <Link 
            to="/" 
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'shipped': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const estimatedDeliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/account/orders"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Orders</span>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Track Your Order</h1>
            <p className="text-gray-600 mt-2">Order ID: {order.id}</p>
          </div>
          <div></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tracking Progress */}
          <div className="lg:col-span-2">
            {/* Current Status */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  order.status === 'delivered' ? 'bg-green-100' :
                  order.status === 'shipped' ? 'bg-purple-100' :
                  order.status === 'processing' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {order.status === 'delivered' ? <CheckCircle className="w-8 h-8 text-green-600" /> :
                   order.status === 'shipped' ? <Truck className="w-8 h-8 text-purple-600" /> :
                   order.status === 'processing' ? <Package className="w-8 h-8 text-yellow-600" /> :
                   <Clock className="w-8 h-8 text-blue-600" />}
                </div>
                <h2 className={`text-2xl font-bold mb-2 font-montserrat ${getStatusColor(order.status)}`}>
                  {order.status === 'delivered' ? 'Delivered!' :
                   order.status === 'shipped' ? 'On the Way!' :
                   order.status === 'processing' ? 'Being Prepared' :
                   'Order Confirmed'}
                </h2>
                <p className="text-gray-600">
                  {order.status === 'delivered' ? 'Your order has been delivered successfully' :
                   order.status === 'shipped' ? 'Your order is on its way to you' :
                   order.status === 'processing' ? 'We are preparing your items for shipment' :
                   'Your order has been confirmed and will be processed soon'}
                </p>
              </div>

              {/* Estimated Delivery */}
              {order.status !== 'delivered' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">Estimated Delivery</span>
                  </div>
                  <p className="text-amber-700">{estimatedDeliveryDate}</p>
                </div>
              )}
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-montserrat">Order Progress</h3>
              
              <div className="space-y-6">
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${
                          step.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </h4>
                        {step.date && (
                          <span className="text-sm text-gray-500">
                            {new Date(step.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        step.completed ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    
                    {index < trackingSteps.length - 1 && (
                      <div className={`absolute left-5 mt-10 w-0.5 h-6 ${
                        step.completed ? 'bg-green-200' : 'bg-gray-200'
                      }`} style={{ marginLeft: '1.25rem' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-montserrat">
                Delivery Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                    <p>{order.shipping.address}</p>
                    <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                  <div className="text-sm text-gray-600 space-y-1">
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
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Method</h4>
                  <p className="text-sm text-gray-600">
                    {order.deliveryOption === 'express' ? 'Express Delivery (2-3 days)' : 'Standard Delivery (5-7 days)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-montserrat">
                Order Summary
              </h3>
              
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.totals.shipping === 0 ? 'FREE' : `₹${order.totals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your order? Our customer service team is here to help.
              </p>
              <div className="space-y-2">
                <Link
                  to="/contact"
                  className="block text-center bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                >
                  Contact Support
                </Link>
                <Link
                  to="/faq"
                  className="block text-center border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
