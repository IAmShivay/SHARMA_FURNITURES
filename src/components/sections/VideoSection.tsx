import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const VideoSection: React.FC = () => {
  // State for active video in mobile view
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  // Featured videos data
  const featuredVideos = [
    {
      id: 'main',
      title: 'The Art of Furniture Making',
      description: 'From selecting the finest materials to applying the final finish, our master craftsmen bring decades of experience to every piece.',
      thumbnail: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Furniture craftsmanship video thumbnail',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 'wood',
      title: 'Our Wood Selection Process',
      description: 'Learn how we source and select the finest sustainable woods for our luxury furniture pieces.',
      thumbnail: 'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Wood selection process video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 'stories',
      title: 'Customer Stories',
      description: 'Hear from our satisfied customers about their experiences with our furniture.',
      thumbnail: 'https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Customer stories video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ];
  
  // Additional videos data
  const additionalVideos = [
    {
      id: 'styling',
      title: 'Living Room Styling Tips',
      duration: '3:45',
      thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Living room styling video'
    },
    {
      id: 'office',
      title: 'Home Office Setup Guide',
      duration: '4:18',
      thumbnail: 'https://images.pexels.com/photos/3773571/pexels-photo-3773571.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Home office setup video'
    },
    {
      id: 'care',
      title: 'Furniture Care Tips',
      duration: '3:22',
      thumbnail: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Furniture care tips video'
    }
  ];
  
  // Navigation functions for mobile carousel
  const nextVideo = () => {
    setActiveVideoIndex((prev) => (prev + 1) % featuredVideos.length);
  };
  
  const prevVideo = () => {
    setActiveVideoIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);
  };
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-amber-600 font-medium font-montserrat">Craftsmanship in Motion</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6 font-montserrat">
            See Our Furniture Come to Life
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-playfair">
            Watch our artisans at work and discover the meticulous attention to detail that goes into every piece of LuxeHome furniture.
          </p>
        </div>

        {/* Mobile Carousel (visible on small screens) */}
        <div className="block md:hidden relative mb-8">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            {/* Current Video Thumbnail */}
            <div className="relative aspect-video bg-gray-900">
              <img 
                src={featuredVideos[activeVideoIndex].thumbnail} 
                alt={featuredVideos[activeVideoIndex].alt} 
                className="w-full h-full object-cover opacity-80"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300"
                  onClick={() => {
                    window.open(featuredVideos[activeVideoIndex].url, '_blank');
                  }}
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-0.5" />
                </button>
              </div>
              
              {/* Video Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-6">
                <h3 className="text-lg font-semibold text-white mb-1 font-montserrat">{featuredVideos[activeVideoIndex].title}</h3>
              </div>
            </div>
            
            <div className="bg-white p-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 font-playfair">
                {featuredVideos[activeVideoIndex].description}
              </p>
            </div>
          </div>
          
          {/* Mobile Navigation Arrows */}
          <button
            onClick={prevVideo}
            className="absolute left-2 top-1/3 transform -translate-y-1/2 bg-white/80 shadow-lg rounded-full p-2 hover:bg-white transition-all duration-200"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={nextVideo}
            className="absolute right-2 top-1/3 transform -translate-y-1/2 bg-white/80 shadow-lg rounded-full p-2 hover:bg-white transition-all duration-200"
            aria-label="Next video"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
          
          {/* Mobile Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {featuredVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveVideoIndex(index)}
                className={`transition-all duration-300 ${index === activeVideoIndex ? 'w-8 h-2 bg-amber-600' : 'w-2 h-2 bg-gray-300'} rounded-full`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Desktop Featured Videos Grid (hidden on small screens) */}
        <div className="hidden md:grid grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Main Featured Video (spans 2 columns) */}
          <div className="col-span-2 group relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl">
            {/* Video Thumbnail with Play Button Overlay */}
            <div className="relative aspect-video bg-gray-900">
              <img 
                src={featuredVideos[0].thumbnail} 
                alt={featuredVideos[0].alt} 
                className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-70"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 group-hover:scale-105"
                  onClick={() => {
                    window.open(featuredVideos[0].url, '_blank');
                  }}
                  aria-label="Play video"
                >
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </button>
              </div>
              
              {/* Video Duration Badge */}
              <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">8:24</div>
            </div>

            {/* Video Caption */}
            <div className="bg-white p-6 border-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">{featuredVideos[0].title}</h3>
              <p className="text-gray-600 font-playfair">
                {featuredVideos[0].description}
              </p>
            </div>
          </div>
          
          {/* Right Side Videos (stacked vertically) */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* Top Right Video */}
            <div className="rounded-xl overflow-hidden shadow-xl h-1/2 group relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative aspect-square md:aspect-auto md:h-full bg-gray-800">
                <img 
                  src={featuredVideos[1].thumbnail} 
                  alt={featuredVideos[1].alt} 
                  className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-amber-700 opacity-90 group-hover:opacity-100"
                    onClick={() => {
                      window.open(featuredVideos[1].url, '_blank');
                    }}
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h4 className="font-medium text-white mb-1 font-montserrat text-sm">{featuredVideos[1].title}</h4>
                  <p className="text-xs text-white/80 font-playfair hidden group-hover:block transition-all duration-300">5:12</p>
                </div>
              </div>
            </div>
            
            {/* Bottom Right Video */}
            <div className="rounded-xl overflow-hidden shadow-xl h-1/2 group relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative aspect-square md:aspect-auto md:h-full bg-gray-800">
                <img 
                  src={featuredVideos[2].thumbnail} 
                  alt={featuredVideos[2].alt} 
                  className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-amber-700 opacity-90 group-hover:opacity-100"
                    onClick={() => {
                      window.open(featuredVideos[2].url, '_blank');
                    }}
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h4 className="font-medium text-white mb-1 font-montserrat text-sm">{featuredVideos[2].title}</h4>
                  <p className="text-xs text-white/80 font-playfair hidden group-hover:block transition-all duration-300">4:30</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Videos Gallery */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center font-montserrat">More Inspiration</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {/* Map through additional videos */}
            {additionalVideos.map((video) => (
              <div 
                key={video.id}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="relative aspect-video bg-gray-800">
                  <img 
                    src={video.thumbnail} 
                    alt={video.alt} 
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center hover:bg-amber-700 opacity-90 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </button>
                  </div>
                  {/* Video Duration Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-medium text-gray-900 mb-1 font-montserrat">{video.title}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 font-playfair">July 2025</p>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">New</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a 
            href="/gallery" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all duration-300 font-montserrat shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View Full Gallery
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
          <p className="mt-4 text-sm text-gray-500 font-playfair">Discover our complete collection of design videos</p>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
