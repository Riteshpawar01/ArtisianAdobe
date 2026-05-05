import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const SidebarFilters = ({ selectedCategories, onToggleCategory }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const categories = [
    { name: 'Decorative Plaques', count: 2 },
    { name: 'Decorative Tapestries', count: 1 },
    { name: 'Home Decor Decals', count: 4 },
    { name: 'Mirrors', count: 1 },
    { name: 'Paintings', count: 1 },
    { name: 'Prints', count: 4 },
    { name: 'Sculptures & Statues', count: 11 },
    { name: 'Visual Artwork', count: 96 },
    { name: 'Wall Clocks', count: 5 },
    { name: 'Tables', count: 8 },
  ];

  return (
    <div className="w-full lg:w-64 flex-shrink-0 pt-2">
      <div className="flex justify-between items-center mb-4 lg:mb-8">
        <h2 className="text-3xl font-serif text-gray-900 font-medium">Filters</h2>
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-900"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>
      
      <div className={`border-t border-gray-200 py-4 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex justify-between items-center mb-4 cursor-pointer group">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">Category</h3>
          <ChevronUp size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
        
        <div className="space-y-3">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategories.includes(cat.name);
            return (
              <label 
                key={idx} 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => onToggleCategory(cat.name)}
              >
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${isSelected ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <span className={`text-[0.85rem] transition-colors ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  {cat.name} ({cat.count})
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
