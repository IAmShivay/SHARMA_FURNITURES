import React from 'react';

// Import all page components
import AboutUs from '../pages/AboutUs';
import Contact from '../pages/Contact';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import ShippingReturns from '../pages/ShippingReturns';
import FAQ from '../pages/FAQ';
import ProductPage from '../pages/ProductPage';
import ProductListingPage from '../pages/ProductListingPage';
import LivingRoomCollection from '../pages/collections/LivingRoomCollection';
import Gallery from '../pages/Gallery';
import DeliveryTracker from '../features/DeliveryTracker';

interface PageRouterProps {
  currentPage: string;
  productId?: string;
}

const PageRouter: React.FC<PageRouterProps> = ({ currentPage, productId }) => {
  switch (currentPage) {
    case 'home':
      return <div>Home Page Content</div>; // Your existing home page
    
    // Footer Pages
    case 'about':
      return <AboutUs />;
    case 'contact':
      return <Contact />;
    case 'privacy':
      return <PrivacyPolicy />;
    case 'terms':
      return <TermsOfService />;
    case 'shipping':
      return <ShippingReturns />;
    case 'faq':
      return <FAQ />;
    
    // Product Pages
    case 'products':
      return <ProductListingPage />;
    case 'product':
      return <ProductPage productId={productId || ''} />;
    
    // Collection Pages
    case 'living-room':
      return <LivingRoomCollection />;
    case 'bedroom':
      return <BedroomCollection />;
    case 'dining':
      return <DiningCollection />;
    case 'office':
      return <OfficeCollection />;
    
    // Gallery & Inspiration
    case 'gallery':
      return <Gallery />;
    case 'inspiration':
      return <InspirationPage />;
    
    // Account Pages
    case 'account':
      return <MyAccount />;
    case 'orders':
      return <OrderHistory />;
    case 'wishlist':
      return <Wishlist />;
    
    // Service Pages
    case 'design-services':
      return <DesignServices />;
    case 'consultation':
      return <Consultation />;
    case 'delivery-tracking':
      return <DeliveryTracker />;
    
    // Blog & Support
    case 'blog':
      return <Blog />;
    case 'care-guide':
      return <CareGuide />;
    case 'assembly':
      return <AssemblyInstructions />;
    case 'support':
      return <CustomerSupport />;
    
    default:
      return <div>Page not found</div>;
  }
};

// Placeholder components for pages not yet created
const BedroomCollection: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Bedroom Collection</h1>
      <p className="text-xl text-gray-600">Coming Soon - Premium bedroom furniture collection</p>
    </div>
  </div>
);

const DiningCollection: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Dining Collection</h1>
      <p className="text-xl text-gray-600">Coming Soon - Elegant dining room furniture</p>
    </div>
  </div>
);

const OfficeCollection: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Office Collection</h1>
      <p className="text-xl text-gray-600">Coming Soon - Professional home office furniture</p>
    </div>
  </div>
);

const InspirationPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Inspiration</h1>
      <p className="text-xl text-gray-600">Coming Soon - Room design ideas and inspiration</p>
    </div>
  </div>
);

const MyAccount: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">My Account</h1>
      <p className="text-xl text-gray-600">Coming Soon - Account management dashboard</p>
    </div>
  </div>
);

const OrderHistory: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Order History</h1>
      <p className="text-xl text-gray-600">Coming Soon - View your past orders</p>
    </div>
  </div>
);

const Wishlist: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
      <p className="text-xl text-gray-600">Coming Soon - Save your favorite items</p>
    </div>
  </div>
);

const DesignServices: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Services</h1>
      <p className="text-xl text-gray-600">Coming Soon - Professional interior design services</p>
    </div>
  </div>
);

const Consultation: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Consultation</h1>
      <p className="text-xl text-gray-600">Coming Soon - Book your free design consultation</p>
    </div>
  </div>
);

const Blog: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Blog</h1>
      <p className="text-xl text-gray-600">Coming Soon - Latest trends and design tips</p>
    </div>
  </div>
);

const CareGuide: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Furniture Care Guide</h1>
      <p className="text-xl text-gray-600">Coming Soon - How to care for your furniture</p>
    </div>
  </div>
);

const AssemblyInstructions: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Assembly Instructions</h1>
      <p className="text-xl text-gray-600">Coming Soon - Step-by-step assembly guides</p>
    </div>
  </div>
);

const CustomerSupport: React.FC = () => (
  <div className="min-h-screen bg-gray-50 pt-32">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h1>
      <p className="text-xl text-gray-600">Coming Soon - Comprehensive support center</p>
    </div>
  </div>
);

export default PageRouter;
