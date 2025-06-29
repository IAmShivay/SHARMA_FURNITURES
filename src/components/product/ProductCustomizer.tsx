import React, { useState, useEffect } from 'react';
import { Check, Info, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/cartUtils';

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
}

interface CustomizationSection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  type: 'single' | 'multiple';
  options: CustomizationOption[];
}

interface ProductCustomizerProps {
  customizationSections: CustomizationSection[];
  onCustomizationChange: (customization: any, totalCost: number) => void;
  className?: string;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  customizationSections,
  onCustomizationChange,
  className = '',
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [sectionId: string]: string | string[] }>({});
  const [totalCustomizationCost, setTotalCustomizationCost] = useState(0);

  // Calculate total customization cost
  useEffect(() => {
    let total = 0;
    
    customizationSections.forEach((section) => {
      const sectionSelection = selectedOptions[section.id];
      
      if (section.type === 'single' && typeof sectionSelection === 'string') {
        const option = section.options.find(opt => opt.id === sectionSelection);
        if (option) total += option.price;
      } else if (section.type === 'multiple' && Array.isArray(sectionSelection)) {
        sectionSelection.forEach((optionId) => {
          const option = section.options.find(opt => opt.id === optionId);
          if (option) total += option.price;
        });
      }
    });
    
    setTotalCustomizationCost(total);
  }, [selectedOptions, customizationSections]);

  // Notify parent of changes
  useEffect(() => {
    const customizationData = customizationSections.reduce((acc, section) => {
      const selection = selectedOptions[section.id];
      if (selection) {
        if (section.type === 'single' && typeof selection === 'string') {
          const option = section.options.find(opt => opt.id === selection);
          if (option) {
            acc[section.id] = {
              optionId: option.id,
              name: option.name,
              price: option.price,
            };
          }
        } else if (section.type === 'multiple' && Array.isArray(selection)) {
          acc[section.id] = selection.map((optionId) => {
            const option = section.options.find(opt => opt.id === optionId);
            return option ? {
              optionId: option.id,
              name: option.name,
              price: option.price,
            } : null;
          }).filter(Boolean);
        }
      }
      return acc;
    }, {} as any);

    onCustomizationChange(customizationData, totalCustomizationCost);
  }, [selectedOptions, totalCustomizationCost, customizationSections]);

  const handleSingleSelection = (sectionId: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [sectionId]: optionId,
    }));
  };

  const handleMultipleSelection = (sectionId: string, optionId: string) => {
    setSelectedOptions(prev => {
      const currentSelection = prev[sectionId] as string[] || [];
      const isSelected = currentSelection.includes(optionId);
      
      return {
        ...prev,
        [sectionId]: isSelected
          ? currentSelection.filter(id => id !== optionId)
          : [...currentSelection, optionId],
      };
    });
  };

  const isOptionSelected = (sectionId: string, optionId: string): boolean => {
    const selection = selectedOptions[sectionId];
    if (Array.isArray(selection)) {
      return selection.includes(optionId);
    }
    return selection === optionId;
  };

  const getSelectedOptionNames = (section: CustomizationSection): string => {
    const selection = selectedOptions[section.id];
    if (!selection) return 'None selected';
    
    if (section.type === 'single' && typeof selection === 'string') {
      const option = section.options.find(opt => opt.id === selection);
      return option ? option.name : 'None selected';
    } else if (section.type === 'multiple' && Array.isArray(selection)) {
      if (selection.length === 0) return 'None selected';
      const names = selection.map(optionId => {
        const option = section.options.find(opt => opt.id === optionId);
        return option?.name;
      }).filter(Boolean);
      return names.join(', ');
    }
    
    return 'None selected';
  };

  if (!customizationSections.length) {
    return null;
  }

  return (
    <div className={`space-y-4 sm:space-y-6 lg:space-y-8 ${className}`}>
      <div className="border-b border-gray-200 pb-3 sm:pb-4">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-montserrat">
          Customize Your Product
        </h3>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          Personalize your furniture to match your style and needs
        </p>
        {totalCustomizationCost > 0 && (
          <div className="mt-2 sm:mt-3 inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Additional cost: {formatPrice(totalCustomizationCost)}
          </div>
        )}
      </div>

      {customizationSections.map((section) => (
        <div key={section.id} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                {section.title}
                {section.required && (
                  <span className="ml-2 text-red-500 text-xs sm:text-sm">*</span>
                )}
              </h4>
              {section.description && (
                <p className="text-gray-600 text-xs sm:text-sm mt-1">{section.description}</p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">
                {section.type === 'single' ? 'Choose one' : 'Choose multiple'}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {getSelectedOptionNames(section)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {section.options.map((option) => {
              const isSelected = isOptionSelected(section.id, option.id);
              const isDisabled = option.available === false; // Only disable if explicitly set to false

              return (
                <div
                  key={option.id}
                  className={`
                    relative border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => {
                    if (isDisabled) return;
                    
                    if (section.type === 'single') {
                      handleSingleSelection(section.id, option.id);
                    } else {
                      handleMultipleSelection(section.id, option.id);
                    }
                  }}
                >
                  {/* Selection indicator */}
                  <div className={`
                    absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected 
                      ? 'border-amber-500 bg-amber-500' 
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Option image */}
                  {option.image && (
                    <div className="mb-3">
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Option details */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">
                      {option.name}
                    </h5>
                    
                    {option.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {option.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`
                        text-sm font-medium
                        ${option.price > 0 ? 'text-amber-600' : 'text-green-600'}
                      `}>
                        {option.price > 0 ? `+${formatPrice(option.price)}` : 'Included'}
                      </span>
                      
                      {!option.available && (
                        <span className="text-xs text-red-500 font-medium">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className={`
                    absolute inset-0 rounded-xl transition-opacity duration-200
                    ${isSelected ? 'bg-amber-500/5' : 'hover:bg-gray-50'}
                    ${isDisabled ? 'hover:bg-transparent' : ''}
                  `} />
                </div>
              );
            })}
          </div>

          {/* Required field validation */}
          {section.required && !selectedOptions[section.id] && (
            <div className="flex items-center text-red-600 text-sm">
              <Info className="w-4 h-4 mr-1" />
              This option is required
            </div>
          )}
        </div>
      ))}

      {/* Summary */}
      {totalCustomizationCost > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Total Customization Cost:
              </span>
              <span className="text-xl font-bold text-amber-600">
                {formatPrice(totalCustomizationCost)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCustomizer;
