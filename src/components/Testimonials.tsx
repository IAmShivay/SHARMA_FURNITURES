import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  image: string;
  productPurchased: string;
}

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      review: 'Absolutely love my new velvet accent chair! The quality is exceptional and it\'s become the centerpiece of my living room. The customer service was outstanding throughout the entire process.',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Velvet Accent Chair'
    },
    {
      id: '2',
      name: 'Michael Chen',
      location: 'San Francisco, CA',
      rating: 5,
      review: 'The Scandinavian dining table exceeded my expectations. Perfect craftsmanship and the wood quality is beautiful. It\'s exactly what we needed for our family dinners.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Scandinavian Dining Table'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      location: 'Austin, TX',
      rating: 5,
      review: 'Fast shipping, beautiful packaging, and the bed frame is stunning! The built-in nightstands are so convenient. Highly recommend this company for quality furniture.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Modern Bed Frame'
    },
    {
      id: '4',
      name: 'David Thompson',
      location: 'Chicago, IL',
      rating: 4,
      review: 'Great ergonomic office chair that has really helped with my back pain during long work days. Assembly was straightforward and the materials feel premium.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Ergonomic Office Chair'
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            What Our Customers Say
          </h2>
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Real stories from customers who have transformed their homes with our furniture
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full -translate-y-16 translate-x-16 opacity-10" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Customer Image */}
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                </div>

                {/* Testimonial Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Rating */}
                  <div className="flex justify-center md:justify-start space-x-1 mb-4">
                    {renderStars(testimonials[currentTestimonial].rating)}
                  </div>

                  {/* Review Text */}
                  <blockquote 
                    className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-gray-600 mb-2">{testimonials[currentTestimonial].location}</p>
                    <p className="text-sm text-amber-600 font-medium">
                      Purchased: {testimonials[currentTestimonial].productPurchased}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonial Indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial 
                    ? 'bg-amber-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center space-x-8 mt-16 opacity-70">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <span className="text-sm font-medium">Free Shipping Over $599</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">30</span>
            </div>
            <span className="text-sm font-medium">30-Day Returns</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">★</span>
            </div>
            <span className="text-sm font-medium">5-Star Customer Service</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;