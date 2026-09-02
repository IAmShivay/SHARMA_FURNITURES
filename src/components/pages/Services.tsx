import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Building2, Sofa, PenTool, Ruler, Palette, Truck, Users, Star,
  ArrowRight, Check, Phone, MessageSquare, Sparkles, Monitor, Clock, Shield,
} from 'lucide-react';
import SEOHead from '../common/SEOHead';

const services = [
  {
    id: 'residential',
    icon: Home,
    title: 'Residential Interior Design',
    subtitle: 'Transform your home into a sanctuary',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Complete interior design for homes — from single rooms to full-home makeovers. Our designers work with your vision, lifestyle, and budget.',
    features: ['Style assessment & mood boards', 'Space planning with 2D/3D layouts', 'Furniture selection from our catalog', 'Color palette & material coordination', 'Lighting design & window treatments', 'Project management & installation'],
    pricing: 'Starting at ₹8,000 per room',
    popular: true,
  },
  {
    id: 'office',
    icon: Building2,
    title: 'Office & Commercial Design',
    subtitle: 'Workspaces that inspire productivity',
    image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Functional, brand-aligned workspaces for offices, co-working spaces, retail stores, and hospitality venues.',
    features: ['Workplace strategy & space optimization', 'Ergonomic furniture planning', 'Brand identity integration', 'Collaborative & private zone design', 'Acoustic & lighting solutions', 'Bulk procurement & volume pricing'],
    pricing: '₹25–55 per sq ft',
    popular: false,
  },
  {
    id: 'styling',
    icon: Sofa,
    title: 'Room Styling & Refresh',
    subtitle: 'Quick, impactful room transformations',
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Not ready for a full redesign? Our stylists refresh your space with curated additions and layout rearrangements.',
    features: ['Assessment of existing layout', 'Curated product recommendations', 'Décor & accessory styling', 'Layout optimization', 'Same-day styling available', 'Budget-friendly options'],
    pricing: 'Starting at ₹4,000 per session',
    popular: false,
  },
  {
    id: 'custom',
    icon: PenTool,
    title: 'Custom Furniture Design',
    subtitle: 'One-of-a-kind pieces built for you',
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Can\'t find exactly what you need? Our craftsmen build custom furniture to your specifications — every detail tailored.',
    features: ['Design sketches & 3D renders', 'Material & finish selection', 'Handcrafted by expert artisans', 'Quality inspection at every stage', 'White-glove delivery & installation', 'Lifetime structural warranty'],
    pricing: 'Starting at ₹15,000 per piece',
    popular: false,
  },
];

const process = [
  { step: 1, icon: MessageSquare, title: 'Discovery Call', desc: 'Free 15-min call to understand your needs, style, and budget', image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { step: 2, icon: Ruler, title: 'Space Assessment', desc: 'We visit your space (or review photos) and take measurements', image: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { step: 3, icon: Palette, title: 'Design Proposal', desc: 'Receive mood boards, 3D layouts, and a curated product list', image: 'https://images.pexels.com/photos/6444968/pexels-photo-6444968.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { step: 4, icon: Monitor, title: 'Revisions', desc: 'Refine the design until it\'s perfect — up to 3 revision rounds', image: 'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { step: 5, icon: Truck, title: 'Delivery & Setup', desc: 'White-glove delivery, professional assembly, and final styling', image: 'https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const stats = [
  { value: '2,500+', label: 'Projects Completed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '150+', label: 'Corporate Clients' },
  { value: '15+', label: 'Years Experience' },
];

const beforeAfter = [
  { label: 'Living Room Makeover', before: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600', after: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: 'Modern Office Setup', before: 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600', after: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: 'Bedroom Redesign', before: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600', after: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead title="Design Services | LuxeHome" description="Professional interior design services — residential, office, room styling, and custom furniture." />

      {/* Hero with background image */}
      <section className="relative text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Professional Design Services</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Design Your <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Dream Space</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              From concept to completion — our expert designers transform homes, offices, and commercial spaces into extraordinary environments.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/consultation" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-7 py-3.5 rounded-xl font-bold hover:scale-105 transition-all hover:shadow-xl">
                Book Consultation <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#services" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all">
                View Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — alternating image+text rows */}
      <section id="services" className="py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Comprehensive design solutions for every space and every budget</p>
          </div>

          <div className="space-y-12 sm:space-y-16">
            {services.map((svc, i) => (
              <div key={svc.id} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 lg:gap-10 items-center`}>
                {/* Image */}
                <div className="lg:w-1/2 w-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                    <img src={svc.image} alt={svc.title} className="w-full h-72 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {svc.popular && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-current" /> Most Popular
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-4 py-2 rounded-lg">{svc.pricing}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svc.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{svc.title}</h3>
                      <p className="text-sm text-amber-600 font-medium">{svc.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">{svc.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/consultation?service=${svc.id}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all hover:shadow-lg">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Before & After</h2>
            <p className="text-gray-600">See the transformation our designers create</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {beforeAfter.map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="grid grid-cols-2 h-48">
                  <div className="relative">
                    <img src={item.before} alt="Before" className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">BEFORE</span>
                  </div>
                  <div className="relative">
                    <img src={item.after} alt="After" className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute bottom-2 right-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded">AFTER</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — horizontal cards with images */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">A seamless journey from first call to final reveal</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {process.map((p) => (
              <div key={p.step} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:scale-[1.02]">
                <div className="h-32 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">{p.step}</span>
                    <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LuxeHome */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Why Choose LuxeHome</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: 'Expert Designers', desc: 'Certified professionals with 10+ years average experience' },
              { icon: Clock, title: 'Quick Turnaround', desc: 'Room designs delivered in 5-7 business days' },
              { icon: Shield, title: 'Satisfaction Guarantee', desc: 'Not happy? We redesign at no extra cost' },
              { icon: Truck, title: 'End-to-End Service', desc: 'Design, procurement, delivery & installation — all handled' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">Book a free discovery call — no commitment, no pressure, just expert advice.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/consultation" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-7 py-3.5 rounded-xl font-bold hover:scale-105 transition-all">
              <Phone className="w-5 h-5" /> Book Free Call
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all">
              <MessageSquare className="w-5 h-5" /> Send a Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
