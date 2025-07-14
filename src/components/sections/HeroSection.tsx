import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Phone } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  theme: 'light' | 'dark';
}

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: HeroSlide[] = [
    {
      id: '1',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Luxury Furniture Redefined',
      subtitle: 'Transform your home with our exclusive collection of handcrafted furniture. Where timeless elegance meets contemporary design.',
      cta: 'Explore Premium Collection',
      ctaLink: '/collections/living-room',
      theme: 'dark'
    },
    {
      id: '2',
      image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Scandinavian Minimalism',
      subtitle: 'Discover the beauty of Nordic design with our curated collection of clean lines, natural materials, and functional elegance.',
      cta: 'Shop Nordic Collection',
      ctaLink: '/collections/bedroom',
      theme: 'light'
    },
    {
      id: '3',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Bespoke Living Spaces',
      subtitle: 'Create your perfect sanctuary with our custom furniture solutions. Every piece tells a story of craftsmanship and luxury.',
      cta: 'Design Your Space',
      ctaLink: '/design-services',
      theme: 'dark'
    },
    {
      id: '4',
      image: 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Modern Comfort Redefined',
      subtitle: 'Experience the perfect blend of style and comfort with our contemporary furniture collection designed for modern living.',
      cta: 'Discover Modern Line',
      ctaLink: '/collections/office',
      theme: 'dark'
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <section className="relative overflow-hidden bg-black" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Premium Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            {/* Background Image with Ken Burns Effect */}
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-linear ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Advanced Overlay System */}
            <div className="absolute inset-0">
              {/* Primary Gradient Overlay */}
              <div className={`absolute inset-0 ${
                slide.theme === 'dark'
                  ? 'bg-gradient-to-br from-black/70 via-black/50 to-black/70'
                  : 'bg-gradient-to-br from-white/60 via-white/30 to-white/60'
              }`} />

              {/* Secondary Radial Overlay for Focus */}
              <div className={`absolute inset-0 ${
                slide.theme === 'dark'
                  ? 'bg-radial-gradient from-transparent via-black/30 to-black/60'
                  : 'bg-radial-gradient from-transparent via-white/20 to-white/50'
              }`} />

              {/* Luxury Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 50m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '100px 100px'
                }}
              />
            </div>

            {/* Premium Content Layout */}
            <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
              <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Content Column */}
                  <div className="text-white space-y-8">
                    {/* Luxury Badge */}
                    <div className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full border transition-all duration-1000 delay-200 bg-white/10 border-white/30 text-white backdrop-blur-sm ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Premium Collection</span>
                    </div>

                    {/* Main Title */}
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight transition-all duration-1000 delay-400 font-montserrat ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}>
                      <span className="block">
                        {slide.title.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                        {slide.title.split(' ').slice(2).join(' ')}
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <p className={`text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl transition-all duration-1000 delay-600 font-playfair text-gray-200 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}>
                      {slide.subtitle}
                    </p>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-800 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}>
                      <Link
                        to={slide.ctaLink}
                        className="group inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:via-orange-700 hover:to-amber-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform-gpu font-montserrat"
                      >
                        <span>{slide.cta}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>

                      <Link
                        to="/consultation"
                        className="group inline-flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 transform-gpu font-montserrat bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 backdrop-blur-sm"
                      >
                        <span>Free Consultation</span>
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>

                  {/* Feature Highlights Column */}
                  <div className={`hidden lg:block space-y-6 transition-all duration-1000 delay-1000 ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-8'
                  }`}>
                    {[
                      { icon: '🏆', title: 'Award-Winning Design', desc: 'Internationally recognized furniture collections' },
                      { icon: '🚚', title: 'White-Glove Delivery', desc: 'Professional setup and installation included' },
                      { icon: '💎', title: 'Lifetime Warranty', desc: 'Comprehensive coverage on all premium pieces' }
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 bg-white/10 border border-white/20 text-white hover:bg-white/15"
                        style={{ animationDelay: `${1200 + idx * 200}ms` }}
                      >
                        <div className="text-2xl">{feature.icon}</div>
                        <div>
                          <h3 className="font-bold text-lg font-montserrat">{feature.title}</h3>
                          <p className="text-sm font-playfair text-gray-300">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 lg:p-4 bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-110 z-20 group border border-white/30 hover:border-white/50 shadow-2xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white group-hover:scale-125 group-hover:-translate-x-1 transition-all duration-300 filter drop-shadow-lg" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 lg:p-4 bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-xl lg:rounded-2xl transition-all duration-500 hover:scale-110 z-20 group border border-white/30 hover:border-white/50 shadow-2xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white group-hover:scale-125 group-hover:translate-x-1 transition-all duration-300 filter drop-shadow-lg" />
      </button>

      {/* Luxury Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 bg-black/30 backdrop-blur-xl rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border border-white/20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-500 group ${
                index === currentSlide
                  ? 'w-8 h-2 sm:w-10 sm:h-2.5 lg:w-12 lg:h-3'
                  : 'w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 hover:w-4 sm:hover:w-5 lg:hover:w-6'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`w-full h-full rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg'
                  : 'bg-white/50 group-hover:bg-white/75'
              }`} />

              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse opacity-50" />
              )}
            </button>
          ))}

          {/* Slide Counter */}
          <div className="hidden sm:block ml-2 sm:ml-3 lg:ml-4 pl-2 sm:pl-3 lg:pl-4 border-l border-white/30">
            <span className="text-white text-xs sm:text-sm font-bold font-montserrat">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-2 sm:bottom-4 right-4 sm:right-6 lg:right-8 z-20">
        <div className="flex flex-col items-center space-y-1 sm:space-y-2 animate-bounce">
          <span className="text-white/80 text-xs font-semibold tracking-wider uppercase hidden sm:block">Scroll</span>
          <div className="w-4 h-6 sm:w-5 sm:h-8 lg:w-6 lg:h-10 border-2 border-white/60 rounded-full flex justify-center relative overflow-hidden">
            <div className="w-0.5 h-2 sm:w-1 sm:h-3 bg-white/80 rounded-full mt-1 sm:mt-2 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Premium Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 z-20">
        <div className="relative h-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-all duration-300 ease-out relative"
            style={{
              width: isAutoPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : '0%'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Luxury Brand Watermark */}
      <div className="absolute top-1/2 right-12 transform -translate-y-1/2 rotate-90 z-10">
        <span className="text-white/20 text-sm font-bold tracking-[0.3em] uppercase font-montserrat">
          Premium Collection
        </span>
      </div>
    </section>
  );
};

export default HeroSection;