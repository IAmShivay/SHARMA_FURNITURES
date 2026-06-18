import React from 'react';
import {
  Award,
  Users,
  Globe,
  Heart,
  Truck,
  Shield,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '50,000+' },
    { icon: Globe, label: 'Countries Served', value: '25+' },
    { icon: Award, label: 'Design Awards', value: '15+' },
    { icon: Star, label: 'Average Rating', value: '4.9/5' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Craftsmanship',
      description: 'Every piece is handcrafted by skilled artisans with decades of experience'
    },
    {
      icon: Shield,
      title: 'Quality',
      description: 'We use only the finest materials and rigorous quality control processes'
    },
    {
      icon: Truck,
      title: 'Service',
      description: 'White-glove delivery and lifetime support for all our customers'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and sustainable sourcing'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: '20+ years in luxury furniture design'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Award-winning furniture designer'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dedicated to exceptional service'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead
        title="About Us | LuxeHome"
        description="Discover LuxeHome's story, mission, and commitment to bringing premium furniture and exceptional design to your home."
        keywords="about luxehome, furniture company, premium home furnishings"
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
              Crafting Dreams Into
              <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Beautiful Reality
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair leading-relaxed">
              For over two decades, LuxeHome has been creating exceptional furniture that transforms houses into homes.
              Our passion for craftsmanship and dedication to quality has made us a trusted name in luxury furniture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Our Story
              </button>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold border-2 border-gray-200 hover:border-amber-500 transition-all duration-300 hover:scale-105">
                Meet Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-montserrat">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 font-playfair text-lg leading-relaxed">
                <p>
                  Founded in 2000 by Sarah Johnson, LuxeHome began as a small workshop in Brooklyn with a simple mission: 
                  to create furniture that combines timeless design with exceptional craftsmanship.
                </p>
                <p>
                  What started as a passion project has grown into a globally recognized brand, but our core values remain unchanged. 
                  We believe that furniture should be more than functional – it should tell a story, evoke emotions, and create lasting memories.
                </p>
                <p>
                  Today, we work with master craftsmen from around the world, using traditional techniques combined with modern innovation 
                  to create pieces that will be treasured for generations.
                </p>
              </div>
              <div className="mt-8">
                <button className="inline-flex items-center space-x-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                  <span>Learn More About Our Process</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our Workshop"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="font-bold text-gray-900">Since 2000</div>
                    <div className="text-sm text-gray-600">Crafting Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 font-playfair max-w-3xl mx-auto">
              These core principles guide everything we do, from design to delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300">
                  <value.icon className="w-10 h-10 text-amber-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-montserrat">
                  {value.title}
                </h3>
                <p className="text-gray-600 font-playfair leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 font-playfair max-w-3xl mx-auto">
              The passionate people behind LuxeHome's success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">
                    {member.name}
                  </h3>
                  <div className="text-amber-600 font-semibold mb-4">
                    {member.role}
                  </div>
                  <p className="text-gray-600 font-playfair">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 font-montserrat">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 font-playfair max-w-2xl mx-auto">
            Discover our complete collection of handcrafted furniture and start creating your dream home today.
          </p>
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            Explore Our Collections
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
