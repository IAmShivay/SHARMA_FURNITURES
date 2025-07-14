import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import { useCart } from './hooks/useCart';
import Header from './components/layout/Header';
import HeroSection from './components/sections/HeroSection';
import CollectionsSection from './components/sections/CollectionsSection';
import ProductShowcase from './components/sections/ProductShowcase';
import VideoSection from './components/sections/VideoSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import NewsletterSection from './components/sections/NewsletterSection';
import Footer from './components/layout/Footer';
import ShoppingCart from './components/ui/ShoppingCart';
import SEOHead from './components/common/SEOHead';
import  { AdminRoute } from './components/auth/ProtectedRoute';

// Page imports
import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import ShippingReturns from './components/pages/ShippingReturns';
import FAQ from './components/pages/FAQ';
import ProductPage from './components/pages/ProductPage';
import ProductListingPage from './components/pages/ProductListingPage';
import LivingRoomCollection from './components/pages/collections/LivingRoomCollection';
import CollectionPage from './components/pages/collections/CollectionPage';
import CollectionsOverview from './components/pages/CollectionsOverview';
import CheckoutPage from './components/pages/checkout/CheckoutPage';
import CheckoutSuccess from './components/pages/checkout/CheckoutSuccess';
import OrderManagement from './components/admin/OrderManagement';
import OrderTracking from './components/pages/OrderTracking';
import Gallery from './components/pages/Gallery';
import DeliveryTracker from './components/features/DeliveryTracker';
import Account from './components/pages/Account';
import Wishlist from './components/pages/Wishlist';
import Login from './components/pages/auth/Login';
import Register from './components/pages/auth/Register';

// Home page component
const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <CollectionsSection />
      <ProductShowcase />
      <VideoSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

// Product page wrapper to handle route params
const ProductPageWrapper: React.FC = () => {
  return <ProductPage />;
};

// App content component (inside Redux provider)
const AppContent: React.FC = () => {
  const {
    cartItems,
    itemCount: cartItemCount,
    isOpen: isCartOpen,
    openCartDrawer: handleCartClick,
    closeCartDrawer: handleCloseCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
  } = useCart();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LuxeHome",
    "url": "https://luxehome.com",
    "description": "Premium furniture and home decor brand offering luxury furniture with modern design and exceptional craftsmanship.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://luxehome.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <SEOHead structuredData={structuredData} />

          <Header cartCount={cartItemCount} onCartClick={handleCartClick} />

          <main>
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Product Routes */}
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/product/:id" element={<ProductPageWrapper />} />

              {/* Collection Routes */}
              <Route path="/collections" element={<CollectionsOverview />} />
              <Route path="/collections/:category" element={<CollectionPage />} />
              <Route path="/collections/living-room" element={<LivingRoomCollection />} />

              {/* Checkout Routes */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success/:orderId" element={<CheckoutSuccess />} />

              {/* User Account Routes */}
              <Route path="/account" element={<Account />} />
              <Route path="/account/orders/:orderId" element={<OrderTracking />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Gallery & Inspiration */}
              <Route path="/gallery" element={<Gallery />} />

              {/* Footer Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/shipping" element={<ShippingReturns />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Service Routes */}
              <Route path="/delivery-tracking" element={<DeliveryTracker />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <OrderManagement />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <OrderManagement />
                </AdminRoute>
              } />
            </Routes>
          </main>

          <Footer />

          <ShoppingCart
            isOpen={isCartOpen}
            onClose={handleCloseCart}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
          />
        </div>
      </Router>
    </HelmetProvider>
  );
};

// Main App component with Redux Provider
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;