import React, { useState, useEffect } from 'react';
import {
  Palette,
  Wrench,
  Package,
  Brush,
  Info,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Heart
} from 'lucide-react';

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  available: boolean;
}

interface CustomizationSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
  type: 'single' | 'multiple';
  options: CustomizationOption[];
}

interface ProductCustomizationProps {
  basePrice: number;
  onCustomizationChange: (customization: any, totalPrice: number) => void;
  onAddToCart: (customization: any) => void;
  onAddToWishlist: () => void;
}

const ProductCustomization: React.FC<ProductCustomizationProps> = ({
  basePrice,
  onCustomizationChange,
  onAddToCart,
  onAddToWishlist
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(basePrice);

  const customizationSections: CustomizationSection[] = [
    {
      id: 'wood-type',
      title: 'Wood Type',
      description: 'Choose your preferred wood material',
      required: true,
      type: 'single',
      options: [
        {
          id: 'oak',
          name: 'Premium Oak',
          price: 0,
          description: 'Classic and durable hardwood with beautiful grain patterns',
          available: true
        },
        {
          id: 'walnut',
          name: 'Rich Walnut',
          price: 299,
          description: 'Luxurious dark wood with sophisticated appearance',
          available: true
        },
        {
          id: 'mahogany',
          name: 'Exotic Mahogany',
          price: 499,
          description: 'Premium tropical hardwood with reddish-brown color',
          available: true
        },
        {
          id: 'teak',
          name: 'Teak Wood',
          price: 699,
          description: 'Weather-resistant premium wood, perfect for longevity',
          available: false
        }
      ]
    },
    {
      id: 'finish',
      title: 'Finish Type',
      description: 'Select the surface finish for your furniture',
      required: true,
      type: 'single',
      options: [
        {
          id: 'natural',
          name: 'Natural Finish',
          price: 0,
          description: 'Clear protective coating that showcases natural wood grain',
          available: true
        },
        {
          id: 'satin',
          name: 'Satin Finish',
          price: 149,
          description: 'Smooth, low-sheen finish that resists fingerprints',
          available: true
        },
        {
          id: 'gloss',
          name: 'High Gloss',
          price: 199,
          description: 'Mirror-like finish for a luxurious appearance',
          available: true
        },
        {
          id: 'distressed',
          name: 'Distressed Finish',
          price: 249,
          description: 'Vintage look with intentional wear patterns',
          available: true
        }
      ]
    },
    {
      id: 'color',
      title: 'Color Options',
      description: 'Choose your preferred color scheme',
      required: true,
      type: 'single',
      options: [
        {
          id: 'natural-brown',
          name: 'Natural Brown',
          price: 0,
          description: 'Classic wood tone',
          available: true
        },
        {
          id: 'espresso',
          name: 'Espresso',
          price: 99,
          description: 'Rich dark brown',
          available: true
        },
        {
          id: 'honey',
          name: 'Honey Oak',
          price: 99,
          description: 'Warm golden tone',
          available: true
        },
        {
          id: 'white-wash',
          name: 'White Wash',
          price: 149,
          description: 'Light, airy appearance',
          available: true
        },
        {
          id: 'black',
          name: 'Ebony Black',
          price: 199,
          description: 'Sophisticated black finish',
          available: true
        }
      ]
    },
    {
      id: 'assembly',
      title: 'Assembly Options',
      description: 'Choose how you want your furniture delivered',
      required: true,
      type: 'single',
      options: [
        {
          id: 'diy',
          name: 'DIY Assembly',
          price: 0,
          description: 'Delivered unassembled with detailed instructions',
          available: true
        },
        {
          id: 'basic',
          name: 'Basic Assembly',
          price: 149,
          description: 'Professional assembly at your location',
          available: true
        },
        {
          id: 'white-glove',
          name: 'White Glove Service',
          price: 299,
          description: 'Full assembly, placement, and packaging removal',
          available: true
        }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware Upgrade',
      description: 'Enhance with premium hardware options',
      required: false,
      type: 'multiple',
      options: [
        {
          id: 'soft-close',
          name: 'Soft-Close Hinges',
          price: 89,
          description: 'Quiet, smooth closing mechanism',
          available: true
        },
        {
          id: 'premium-handles',
          name: 'Premium Handles',
          price: 129,
          description: 'Upgraded metal handles with better grip',
          available: true
        },
        {
          id: 'led-lighting',
          name: 'LED Accent Lighting',
          price: 199,
          description: 'Built-in LED strips for ambient lighting',
          available: true
        }
      ]
    },
    {
      id: 'protection',
      title: 'Protection Plans',
      description: 'Protect your investment with extended coverage',
      required: false,
      type: 'single',
      options: [
        {
          id: 'basic-warranty',
          name: '2-Year Extended Warranty',
          price: 199,
          description: 'Covers manufacturing defects and normal wear',
          available: true
        },
        {
          id: 'premium-warranty',
          name: '5-Year Premium Protection',
          price: 399,
          description: 'Comprehensive coverage including accidental damage',
          available: true
        },
        {
          id: 'lifetime-warranty',
          name: 'Lifetime Warranty',
          price: 699,
          description: 'Lifetime coverage with annual maintenance',
          available: true
        }
      ]
    }
  ];

  const handleOptionChange = (sectionId: string, optionId: string) => {
    setSelectedOptions(prev => {
      const section = customizationSections.find(s => s.id === sectionId);
      if (!section) return prev;

      if (section.type === 'single') {
        return {
          ...prev,
          [sectionId]: [optionId]
        };
      } else {
        const currentOptions = prev[sectionId] || [];
        const isSelected = currentOptions.includes(optionId);
        
        return {
          ...prev,
          [sectionId]: isSelected
            ? currentOptions.filter(id => id !== optionId)
            : [...currentOptions, optionId]
        };
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = basePrice;
    
    customizationSections.forEach(section => {
      const selectedIds = selectedOptions[section.id] || [];
      selectedIds.forEach(optionId => {
        const option = section.options.find(opt => opt.id === optionId);
        if (option) {
          total += option.price;
        }
      });
    });
    
    return total * quantity;
  };

  useEffect(() => {
    const newTotal = calculateTotalPrice();
    setTotalPrice(newTotal);
    onCustomizationChange(selectedOptions, newTotal);
  }, [selectedOptions, quantity, basePrice]);

  const handleAddToCart = () => {
    onAddToCart({
      customization: selectedOptions,
      quantity,
      totalPrice
    });
  };

  const isValidConfiguration = () => {
    return customizationSections
      .filter(section => section.required)
      .every(section => selectedOptions[section.id]?.length > 0);
  };

  return (
    <div className="space-y-8">
      {/* Customization Sections */}
      {customizationSections.map((section) => (
        <div key={section.id} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                {section.id === 'wood-type' && <Package className="w-5 h-5 text-amber-600" />}
                {section.id === 'finish' && <Brush className="w-5 h-5 text-amber-600" />}
                {section.id === 'color' && <Palette className="w-5 h-5 text-amber-600" />}
                {section.id === 'assembly' && <Wrench className="w-5 h-5 text-amber-600" />}
                {section.id === 'hardware' && <Plus className="w-5 h-5 text-amber-600" />}
                {section.id === 'protection' && <Info className="w-5 h-5 text-amber-600" />}
                <span>{section.title}</span>
                {section.required && <span className="text-red-500 text-sm">*</span>}
              </h3>
              <p className="text-gray-600 mt-1">{section.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.options.map((option) => {
              const isSelected = selectedOptions[section.id]?.includes(option.id) || false;
              
              return (
                <button
                  key={option.id}
                  onClick={() => option.available && handleOptionChange(section.id, option.id)}
                  disabled={!option.available}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    !option.available
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-600">
                          {option.price === 0 ? 'Included' : `+$${option.price}`}
                        </span>
                        {!option.available && (
                          <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                    {isSelected && option.available && (
                      <Check className="w-5 h-5 text-amber-600 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quantity and Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-lg font-semibold text-gray-900">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="text-center lg:text-right">
            <div className="text-sm text-gray-600 mb-1">Total Price</div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalPrice.toLocaleString()}
            </div>
            {quantity > 1 && (
              <div className="text-sm text-gray-500">
                ${(totalPrice / quantity).toLocaleString()} each
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            disabled={!isValidConfiguration()}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
              isValidConfiguration()
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={onAddToWishlist}
            className="flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-bold text-lg border-2 border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600 transition-all duration-300"
          >
            <Heart className="w-6 h-6" />
            <span>Add to Wishlist</span>
          </button>
        </div>

        {!isValidConfiguration() && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              Please select all required options before adding to cart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCustomization;
