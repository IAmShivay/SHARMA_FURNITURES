import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  image: string;
  productPurchased: string;
  title: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      location: 'New York, NY',
      title: 'Interior Designer',
      rating: 5,
      review: 'LuxeHome has completely transformed how I approach furniture selection for my clients. The quality is exceptional, and every piece tells a story of craftsmanship. The velvet accent chair has become the centerpiece of my living room, and I receive compliments daily.',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Velvet Accent Chair'
    },
    {
      id: '2',
      name: 'Michael Chen',
      location: 'San Francisco, CA',
      title: 'Tech Executive',
      rating: 5,
      review: 'The Scandinavian dining table exceeded every expectation. The wood quality is beautiful, and the craftsmanship is evident in every detail. It\'s not just furniture; it\'s an investment in our family\'s daily life. The white-glove delivery service was impeccable.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Scandinavian Dining Table'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      location: 'Austin, TX',
      title: 'Architect',
      rating: 5,
      review: 'As an architect, I appreciate exceptional design and quality construction. LuxeHome delivers both in spades. The modern platform bed with integrated nightstands is a masterpiece of functional design. The LED accent lighting adds the perfect ambiance to our bedroom sanctuary.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Modern Platform Bed'
    },
    {
      id: '4',
      name: 'David Thompson',
      location: 'Chicago, IL',
      title: 'Business Owner',
      rating: 5,
      review: 'The executive office chair has revolutionized my work-from-home experience. The ergonomic design and premium materials make long work days comfortable and productive. LuxeHome\'s attention to detail and customer service is unmatched in the furniture industry.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      productPurchased: 'Executive Office Chair'
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
    <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Quote className="w-6 h-6 text-amber-600" />
            <span className="text-amber-600 font-medium font-montserrat">Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Voices of Satisfaction
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-playfair">
            Real stories from customers who have transformed their homes with our exceptional furniture
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full -translate-y-20 translate-x-20 opacity-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full translate-y-16 -translate-x-16 opacity-10" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
                {/* Customer Image & Info */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="relative inline-block">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-600 rounded-full p-2">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-1 font-montserrat">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-amber-600 font-medium mb-1 font-montserrat">
                      {testimonials[currentTestimonial].title}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      {testimonials[currentTestimonial].location}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex justify-center lg:justify-start space-x-1 mb-4">
                      {renderStars(testimonials[currentTestimonial].rating)}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg px-4 py-2 inline-block">
                      <p className="text-sm text-gray-600 font-medium">
                        Purchased: {testimonials[currentTestimonial].productPurchased}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1">
                  <div className="mb-6">
                    <Quote className="w-12 h-12 text-amber-600 opacity-50 mb-4" />
                  </div>
                  
                  <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-playfair italic">
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonial Indicators */}
          <div className="flex justify-center space-x-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'w-12 h-3 bg-amber-600 rounded-full' 
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 opacity-80">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">Free White-Glove Delivery</h4>
            <p className="text-sm text-gray-600 font-playfair">Orders over $1,000</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">30</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">Day Returns</h4>
            <p className="text-sm text-gray-600 font-playfair">Hassle-free returns</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white fill-current" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">5-Star Service</h4>
            <p className="text-sm text-gray-600 font-playfair">Award-winning support</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">∞</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 font-montserrat">Lifetime Warranty</h4>
            <p className="text-sm text-gray-600 font-playfair">Quality guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;