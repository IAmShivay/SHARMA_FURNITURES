import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  X, 
  Filter,
  Check,
  Minus,
  Plus
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
  selected: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

interface RatingFilter {
  stars: number;
  andUp: boolean;
  count: number;
  selected: boolean;
}

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'price' | 'rating' | 'color';
  expanded: boolean;
  options: FilterOption[];
  priceRange?: PriceRange;
  ratings?: RatingFilter[];
  colors?: { id: string; name: string; hex: string; count: number; selected: boolean }[];
}

interface AmazonStyleFiltersProps {
  onFiltersChange: (filters: any) => void;
  productCount: number;
  loading?: boolean;
}

const AmazonStyleFilters: React.FC<AmazonStyleFiltersProps> = ({ 
  onFiltersChange, 
  productCount, 
  loading = false 
}) => {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox',
      expanded: true,
      options: [
        { id: 'sofas', label: 'Sofas & Sectionals', count: 156, selected: false },
        { id: 'chairs', label: 'Chairs & Recliners', count: 89, selected: false },
        { id: 'tables', label: 'Tables', count: 234, selected: false },
        { id: 'storage', label: 'Storage & Organization', count: 67, selected: false },
        { id: 'lighting', label: 'Lighting', count: 123, selected: false },
        { id: 'decor', label: 'Home Decor', count: 345, selected: false },
      ]
    },
    {
      id: 'price',
      title: 'Price',
      type: 'price',
      expanded: true,
      options: [
        { id: 'under-500', label: 'Under ₹500', count: 89, selected: false },
        { id: '500-1000', label: '₹500 to ₹1,000', count: 156, selected: false },
        { id: '1000-2000', label: '₹1,000 to ₹2,000', count: 234, selected: false },
        { id: '2000-5000', label: '₹2,000 to ₹5,000', count: 123, selected: false },
        { id: 'over-5000', label: '₹5,000 & Above', count: 45, selected: false },
      ],
      priceRange: { min: 0, max: 10000 }
    },
    {
      id: 'brand',
      title: 'Brand',
      type: 'checkbox',
      expanded: true,
      options: [
        { id: 'luxehome', label: 'LuxeHome', count: 234, selected: false },
        { id: 'west-elm', label: 'West Elm', count: 156, selected: false },
        { id: 'pottery-barn', label: 'Pottery Barn', count: 123, selected: false },
        { id: 'crate-barrel', label: 'Crate & Barrel', count: 89, selected: false },
        { id: 'restoration', label: 'Restoration Hardware', count: 67, selected: false },
      ]
    },
    {
      id: 'material',
      title: 'Material',
      type: 'checkbox',
      expanded: false,
      options: [
        { id: 'wood', label: 'Wood', count: 345, selected: false },
        { id: 'metal', label: 'Metal', count: 234, selected: false },
        { id: 'fabric', label: 'Fabric', count: 189, selected: false },
        { id: 'leather', label: 'Leather', count: 156, selected: false },
        { id: 'glass', label: 'Glass', count: 89, selected: false },
        { id: 'marble', label: 'Marble', count: 67, selected: false },
      ]
    },
    {
      id: 'color',
      title: 'Color',
      type: 'color',
      expanded: false,
      options: [],
      colors: [
        { id: 'black', name: 'Black', hex: '#000000', count: 234, selected: false },
        { id: 'white', name: 'White', hex: '#FFFFFF', count: 189, selected: false },
        { id: 'brown', name: 'Brown', hex: '#8B4513', count: 156, selected: false },
        { id: 'gray', name: 'Gray', hex: '#808080', count: 123, selected: false },
        { id: 'beige', name: 'Beige', hex: '#F5F5DC', count: 89, selected: false },
        { id: 'navy', name: 'Navy', hex: '#000080', count: 67, selected: false },
      ]
    },
    {
      id: 'rating',
      title: 'Customer Reviews',
      type: 'rating',
      expanded: false,
      options: [],
      ratings: [
        { stars: 4, andUp: true, count: 456, selected: false },
        { stars: 3, andUp: true, count: 678, selected: false },
        { stars: 2, andUp: true, count: 789, selected: false },
        { stars: 1, andUp: true, count: 890, selected: false },
      ]
    },
    {
      id: 'availability',
      title: 'Availability',
      type: 'checkbox',
      expanded: false,
      options: [
        { id: 'in-stock', label: 'In Stock', count: 567, selected: false },
        { id: 'on-sale', label: 'On Sale', count: 123, selected: false },
        { id: 'free-shipping', label: 'Free Shipping', count: 345, selected: false },
        { id: 'fast-delivery', label: 'Fast Delivery', count: 234, selected: false },
      ]
    },
    {
      id: 'style',
      title: 'Style',
      type: 'checkbox',
      expanded: false,
      options: [
        { id: 'modern', label: 'Modern', count: 234, selected: false },
        { id: 'traditional', label: 'Traditional', count: 189, selected: false },
        { id: 'contemporary', label: 'Contemporary', count: 156, selected: false },
        { id: 'scandinavian', label: 'Scandinavian', count: 123, selected: false },
        { id: 'industrial', label: 'Industrial', count: 89, selected: false },
        { id: 'rustic', label: 'Rustic', count: 67, selected: false },
      ]
    }
  ]);

  const [customPriceRange, setCustomPriceRange] = useState({ min: '', max: '' });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setFilters(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };

  const handleOptionChange = (sectionId: string, optionId: string) => {
    setFilters(prev => prev.map(section => {
      if (section.id === sectionId) {
        if (section.type === 'radio') {
          return {
            ...section,
            options: section.options.map(option => ({
              ...option,
              selected: option.id === optionId
            }))
          };
        } else {
          return {
            ...section,
            options: section.options.map(option => 
              option.id === optionId 
                ? { ...option, selected: !option.selected }
                : option
            )
          };
        }
      }
      return section;
    }));
  };

  const handleColorChange = (colorId: string) => {
    setFilters(prev => prev.map(section => {
      if (section.id === 'color' && section.colors) {
        return {
          ...section,
          colors: section.colors.map(color => 
            color.id === colorId 
              ? { ...color, selected: !color.selected }
              : color
          )
        };
      }
      return section;
    }));
  };

  const handleRatingChange = (stars: number) => {
    setFilters(prev => prev.map(section => {
      if (section.id === 'rating' && section.ratings) {
        return {
          ...section,
          ratings: section.ratings.map(rating => ({
            ...rating,
            selected: rating.stars === stars ? !rating.selected : false
          }))
        };
      }
      return section;
    }));
  };

  const clearFilter = (sectionId: string, optionId?: string) => {
    setFilters(prev => prev.map(section => {
      if (section.id === sectionId) {
        if (optionId) {
          if (section.colors) {
            return {
              ...section,
              colors: section.colors.map(color => 
                color.id === optionId ? { ...color, selected: false } : color
              )
            };
          } else if (section.ratings) {
            return {
              ...section,
              ratings: section.ratings.map(rating => 
                rating.stars.toString() === optionId ? { ...rating, selected: false } : rating
              )
            };
          } else {
            return {
              ...section,
              options: section.options.map(option => 
                option.id === optionId ? { ...option, selected: false } : option
              )
            };
          }
        } else {
          return {
            ...section,
            options: section.options.map(option => ({ ...option, selected: false })),
            colors: section.colors?.map(color => ({ ...color, selected: false })),
            ratings: section.ratings?.map(rating => ({ ...rating, selected: false }))
          };
        }
      }
      return section;
    }));
  };

  const clearAllFilters = () => {
    setFilters(prev => prev.map(section => ({
      ...section,
      options: section.options.map(option => ({ ...option, selected: false })),
      colors: section.colors?.map(color => ({ ...color, selected: false })),
      ratings: section.ratings?.map(rating => ({ ...rating, selected: false }))
    })));
    setCustomPriceRange({ min: '', max: '' });
  };

  // Update active filters for display
  useEffect(() => {
    const active: string[] = [];
    filters.forEach(section => {
      section.options.forEach(option => {
        if (option.selected) {
          active.push(`${section.title}: ${option.label}`);
        }
      });
      section.colors?.forEach(color => {
        if (color.selected) {
          active.push(`Color: ${color.name}`);
        }
      });
      section.ratings?.forEach(rating => {
        if (rating.selected) {
          active.push(`${rating.stars}+ Stars`);
        }
      });
    });
    setActiveFilters(active);
  }, [filters]);

  // Emit filter changes
  useEffect(() => {
    const filterData = {
      categories: filters.find(f => f.id === 'category')?.options.filter(o => o.selected).map(o => o.id) || [],
      brands: filters.find(f => f.id === 'brand')?.options.filter(o => o.selected).map(o => o.id) || [],
      materials: filters.find(f => f.id === 'material')?.options.filter(o => o.selected).map(o => o.id) || [],
      colors: filters.find(f => f.id === 'color')?.colors?.filter(c => c.selected).map(c => c.id) || [],
      styles: filters.find(f => f.id === 'style')?.options.filter(o => o.selected).map(o => o.id) || [],
      availability: filters.find(f => f.id === 'availability')?.options.filter(o => o.selected).map(o => o.id) || [],
      priceRanges: filters.find(f => f.id === 'price')?.options.filter(o => o.selected).map(o => o.id) || [],
      ratings: filters.find(f => f.id === 'rating')?.ratings?.filter(r => r.selected).map(r => r.stars) || [],
      customPriceRange: customPriceRange.min || customPriceRange.max ? customPriceRange : null
    };
    onFiltersChange(filterData);
  }, [filters, customPriceRange, onFiltersChange]);

  const renderStars = (count: number, filled: boolean = true) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < count 
            ? filled ? 'text-yellow-400 fill-current' : 'text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${productCount.toLocaleString()} results`}
        </p>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters</h4>
          <div className="space-y-2">
            {activeFilters.map((filter, index) => (
              <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-blue-800">{filter}</span>
                <button
                  onClick={() => {
                    const [section, option] = filter.split(': ');
                    const sectionId = filters.find(f => f.title === section)?.id;
                    if (sectionId) {
                      clearFilter(sectionId, option);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
        {filters.map((section) => (
          <div key={section.id} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <h4 className="font-semibold text-gray-900">{section.title}</h4>
              {section.expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {section.expanded && (
              <div className="mt-3 space-y-2">
                {/* Regular Options */}
                {section.type === 'checkbox' || section.type === 'radio' ? (
                  section.options.map((option) => (
                    <label key={option.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type={section.type}
                        checked={option.selected}
                        onChange={() => handleOptionChange(section.id, option.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-sm text-gray-700">{option.label}</span>
                      <span className="text-xs text-gray-500">({option.count})</span>
                    </label>
                  ))
                ) : null}

                {/* Price Range */}
                {section.type === 'price' && (
                  <div className="space-y-3">
                    {section.options.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={option.selected}
                          onChange={() => handleOptionChange(section.id, option.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex-1 text-sm text-gray-700">{option.label}</span>
                        <span className="text-xs text-gray-500">({option.count})</span>
                      </label>
                    ))}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Custom Range</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={customPriceRange.min}
                          onChange={(e) => setCustomPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={customPriceRange.max}
                          onChange={(e) => setCustomPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Options */}
                {section.type === 'color' && section.colors && (
                  <div className="grid grid-cols-3 gap-2">
                    {section.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => handleColorChange(color.id)}
                        className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                          color.selected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300 mb-1"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs text-gray-700">{color.name}</span>
                        <span className="text-xs text-gray-500">({color.count})</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Rating Options */}
                {section.type === 'rating' && section.ratings && (
                  section.ratings.map((rating) => (
                    <button
                      key={rating.stars}
                      onClick={() => handleRatingChange(rating.stars)}
                      className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-50 ${
                        rating.selected ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {renderStars(rating.stars)}
                        <span className="text-sm text-gray-600">& Up</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-auto">({rating.count})</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmazonStyleFilters;
