import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    {
      name: 'Living Room',
      href: '#living-room',
      submenu: [
        { name: 'Sofas & Sectionals', href: '#sofas' },
        { name: 'Coffee Tables', href: '#coffee-tables' },
        { name: 'TV Stands', href: '#tv-stands' },
        { name: 'Accent Chairs', href: '#accent-chairs' },
      ]
    },
    {
      name: 'Bedroom',
      href: '#bedroom',
      submenu: [
        { name: 'Beds & Frames', href: '#beds' },
        { name: 'Dressers', href: '#dressers' },
        { name: 'Nightstands', href: '#nightstands' },
        { name: 'Wardrobes', href: '#wardrobes' },
      ]
    },
    {
      name: 'Dining',
      href: '#dining',
      submenu: [
        { name: 'Dining Tables', href: '#dining-tables' },
        { name: 'Dining Chairs', href: '#dining-chairs' },
        { name: 'Bar Stools', href: '#bar-stools' },
        { name: 'Buffets', href: '#buffets' },
      ]
    },
    {
      name: 'Office',
      href: '#office',
      submenu: [
        { name: 'Desks', href: '#desks' },
        { name: 'Office Chairs', href: '#office-chairs' },
        { name: 'Bookcases', href: '#bookcases' },
        { name: 'Storage', href: '#storage' },
      ]
    },
    { name: 'Sale', href: '#sale', highlight: true },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 text-center py-2 px-4 text-sm font-medium">
        Free shipping on orders over ₹599 | Design consultation available
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-amber-600">Luxe</span>Home
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    item.highlight
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-gray-700 hover:text-amber-600'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.submenu && <ChevronDown className="w-4 h-4" />}
                </a>

                {/* Mega Menu Dropdown */}
                {item.submenu && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-4 opacity-0 animate-in fade-in duration-200">
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-6 py-3 text-sm text-gray-700 hover:text-amber-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <button
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4 animate-in slide-in-from-top duration-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for furniture..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top duration-200">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                  item.highlight
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;