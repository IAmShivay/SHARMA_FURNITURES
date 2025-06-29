import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-amber-600">Luxe</span>Home
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
              Transforming homes with premium furniture that combines timeless design, exceptional craftsmanship, and modern functionality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Shop Categories
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Living Room</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Bedroom</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Dining Room</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Office</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Outdoor</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Sale Items</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Size Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">Care Instructions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-600 transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Get in Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-gray-300">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-gray-300">hello@luxehome.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-gray-300">
                  <p>123 Design Avenue</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-amber-600">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r-lg transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} LuxeHome. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Accessibility</a>
              <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors duration-200">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;