import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  User,
  Building,
  Globe
} from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 9547587246', '+91 9547587246'],
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@luxehome.com', 'support@luxehome.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Showroom',
      details: ['123 Design District', 'New York, NY 10001'],
      description: 'Visit our flagship store'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Mon-Sat: 10AM-8PM', 'Sunday: 12PM-6PM'],
      description: 'Extended holiday hours'
    }
  ];

  const locations = [
    {
      city: 'New York',
      address: '123 Design District, NY 10001',
      phone: '+91 9547587246',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      city: 'Los Angeles',
      address: '456 Furniture Ave, LA 90210',
      phone: '+91 9547587246',
      image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      city: 'Chicago',
      address: '789 Home Street, Chicago 60601',
      phone: '+91 9547587246',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead
        title="Contact Us | LuxeHome"
        description="Get in touch with LuxeHome. We're here to help with your furniture needs, design consultations, and customer support."
        keywords="contact luxehome, furniture store contact, customer support"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair max-w-3xl mx-auto">
            Have questions about our furniture? Need design consultation? We're here to help you create your perfect space.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 text-center hover:shadow-2xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-montserrat">
                  {info.title}
                </h3>
                <div className="space-y-2 mb-4">
                  {info.details.map((detail, idx) => (
                    <div key={idx} className="text-gray-700 font-medium">
                      {detail}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 font-playfair">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-montserrat">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="design">Design Consultation</option>
                      <option value="custom">Custom Furniture</option>
                      <option value="support">Customer Support</option>
                      <option value="wholesale">Wholesale</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-8 rounded-2xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat">
                  Quick Actions
                </h3>
                
                <div className="space-y-4">
                  <button className="w-full bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-3">
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </button>
                  
                  <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>Live Chat</span>
                  </button>
                  
                  <button className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-3">
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Consultation</span>
                  </button>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat">
                  Common Questions
                </h3>
                
                <div className="space-y-4">
                  <a href="#" className="block p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors duration-200">
                    <div className="font-semibold text-gray-900">Delivery Information</div>
                    <div className="text-sm text-gray-600">Shipping times and white-glove service</div>
                  </a>
                  
                  <a href="#" className="block p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors duration-200">
                    <div className="font-semibold text-gray-900">Custom Orders</div>
                    <div className="text-sm text-gray-600">Bespoke furniture and modifications</div>
                  </a>
                  
                  <a href="#" className="block p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors duration-200">
                    <div className="font-semibold text-gray-900">Warranty & Care</div>
                    <div className="text-sm text-gray-600">Product care and warranty information</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Visit Our Showrooms
            </h2>
            <p className="text-xl text-gray-600 font-playfair max-w-3xl mx-auto">
              Experience our furniture in person at one of our beautiful showrooms
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {locations.map((location, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={location.image}
                  alt={`${location.city} Showroom`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-montserrat">
                    {location.city}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{location.phone}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors duration-200">
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
