import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  MessageSquare,
  Calendar,
  User,
  Home,
  Star
} from 'lucide-react';

interface DeliveryStatus {
  id: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
  timestamp: string;
  location?: string;
  description: string;
}

interface DeliveryInfo {
  orderId: string;
  productName: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentStatus: string;
  trackingNumber: string;
  deliveryAddress: string;
  deliveryPartner: string;
  driverName?: string;
  driverPhone?: string;
  specialInstructions?: string;
  statuses: DeliveryStatus[];
}

const DeliveryTracker: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<string>('ORD-2024-001');
  const [showDriverContact, setShowDriverContact] = useState(false);

  // Sample delivery data
  const deliveryData: DeliveryInfo = {
    orderId: 'ORD-2024-001',
    productName: 'Premium Scandinavian Sofa',
    estimatedDelivery: '2024-01-15',
    currentStatus: 'out-for-delivery',
    trackingNumber: 'LH2024001234',
    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    deliveryPartner: 'LuxeHome White-Glove Delivery',
    driverName: 'Michael Johnson',
    driverPhone: '+91 9547587246',
    specialInstructions: 'Please call before delivery. Assembly required.',
    statuses: [
      {
        id: '1',
        status: 'confirmed',
        timestamp: '2024-01-10T10:00:00Z',
        description: 'Order confirmed and payment processed'
      },
      {
        id: '2',
        status: 'processing',
        timestamp: '2024-01-11T14:30:00Z',
        description: 'Item being prepared for shipment'
      },
      {
        id: '3',
        status: 'shipped',
        timestamp: '2024-01-12T09:15:00Z',
        location: 'LuxeHome Warehouse, Brooklyn',
        description: 'Package shipped from our warehouse'
      },
      {
        id: '4',
        status: 'out-for-delivery',
        timestamp: '2024-01-15T08:00:00Z',
        location: 'Local Delivery Hub, Manhattan',
        description: 'Out for delivery - Expected between 2:00 PM - 6:00 PM'
      }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-600" />;
      case 'out-for-delivery':
        return <MapPin className="w-6 h-6 text-orange-600" />;
      case 'delivered':
        return <Home className="w-6 h-6 text-green-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-200';
      case 'processing':
        return 'bg-blue-100 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 border-purple-200';
      case 'out-for-delivery':
        return 'bg-orange-100 border-orange-200';
      case 'delivered':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            Track Your Delivery
          </h1>
          <p className="text-xl text-gray-600 font-playfair">
            Real-time updates on your furniture delivery
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
                    {deliveryData.productName}
                  </h2>
                  <p className="text-gray-600">Order #{deliveryData.orderId}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Tracking Number</div>
                  <div className="font-mono font-semibold text-gray-900">
                    {deliveryData.trackingNumber}
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-full shadow-md">
                    {getStatusIcon(deliveryData.currentStatus)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 capitalize">
                      {deliveryData.currentStatus.replace('-', ' ')}
                    </h3>
                    <p className="text-gray-600">
                      Expected delivery: {formatDate(deliveryData.estimatedDelivery)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Timeline</h3>
                <div className="relative">
                  {deliveryData.statuses.map((status, index) => (
                    <div key={status.id} className="relative flex items-start space-x-4 pb-8">
                      {/* Timeline Line */}
                      {index < deliveryData.statuses.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      {/* Status Icon */}
                      <div className={`relative z-10 p-3 rounded-full border-2 ${getStatusColor(status.status)}`}>
                        {getStatusIcon(status.status)}
                      </div>
                      
                      {/* Status Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 capitalize">
                            {status.status.replace('-', ' ')}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(status.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{status.description}</p>
                        {status.location && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {status.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Special Instructions
              </h3>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-gray-700">{deliveryData.specialInstructions}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Delivery Address</div>
                  <div className="font-medium text-gray-900">{deliveryData.deliveryAddress}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Delivery Partner</div>
                  <div className="font-medium text-gray-900">{deliveryData.deliveryPartner}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Estimated Delivery</div>
                  <div className="font-medium text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(deliveryData.estimatedDelivery)}
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Contact */}
            {deliveryData.driverName && (
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Delivery Driver</h3>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{deliveryData.driverName}</div>
                    <div className="text-sm text-gray-600">Professional Delivery Specialist</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Call Driver</span>
                  </button>
                  
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </div>

                <div className="mt-4 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.9/5 rating • 500+ deliveries</span>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200">
                  Contact Support
                </button>
                
                <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200">
                  Reschedule Delivery
                </button>
                
                <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200">
                  Delivery FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;
