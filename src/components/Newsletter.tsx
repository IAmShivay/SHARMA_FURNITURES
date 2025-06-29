import React, { useState } from 'react';
import { Mail, CheckCircle, MapPin, Phone, Clock } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Newsletter Signup */}
          <div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Stay in Style
            </h2>
            <p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Get exclusive access to new collections, design tips, and special offers. 
              Join over 50,000 style enthusiasts who trust us to inspire their homes.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
                </button>
                <p className="text-sm text-gray-400">
                  By subscribing, you agree to our Privacy Policy and consent to receiving marketing emails.
                </p>
              </form>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to the LuxeHome Family!</h3>
                <p className="text-gray-300">
                  You'll receive your first design inspiration email within 24 hours.
                </p>
              </div>
            )}

            {/* Design Consultation CTA */}
            <div className="mt-12 p-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg">
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Free Design Consultation
              </h3>
              <p className="text-gray-300 mb-4">
                Need help choosing the perfect pieces? Our design experts are here to help you create your dream space.
              </p>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                Book Consultation
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 
              className="text-3xl font-bold mb-8"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Visit Our Showrooms
            </h3>

            <div className="space-y-8">
              {/* Showroom 1 */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-xl font-semibold mb-4 text-amber-400">Manhattan Flagship</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">123 Design Avenue</p>
                      <p className="text-gray-300">New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-300">(555) 123-4567</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300">
                      <p>Mon-Sat: 10am-8pm</p>
                      <p>Sunday: 11am-6pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Showroom 2 */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-xl font-semibold mb-4 text-amber-400">Brooklyn Design Studio</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">456 Creative Street</p>
                      <p className="text-gray-300">Brooklyn, NY 11201</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-300">(555) 987-6543</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300">
                      <p>Tue-Sat: 11am-7pm</p>
                      <p>Sun-Mon: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Services */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-amber-400">Our Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full" />
                    <span>Interior Design Consultation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full" />
                    <span>White Glove Delivery</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full" />
                    <span>Assembly & Installation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full" />
                    <span>Custom Furniture Design</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;