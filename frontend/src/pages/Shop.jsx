import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import SidebarFilters from '../components/product/SidebarFilters';
import ProductCard from '../components/product/ProductCard';
import RecentPurchasePopup from '../components/common/RecentPurchasePopup';
import { AlignJustify, GripHorizontal, Grid3x3, Grid, ChevronDown } from 'lucide-react';

const Shop = () => {
  const { section } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';

  // If searching globally (on / path), don't restrict to default 'wall-art' section
  const currentSection = section || (searchTerm ? null : 'wall-art');
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('featured'); // featured, low, high
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await response.json();
        if (data.success) {
          const adaptedProducts = data.data.map(p => ({
            id: p._id || p.id,
            title: p.name,
            salePrice: p.price,
            originalPrice: p.compareAtPrice,
            category: p.subcategory || p.category, 
            section: p.category, 
            image: p.images && p.images.length > 0 ? p.images[0].url : '',
            isNew: false
          }));
          setAllProducts(adaptedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  let displayProducts = allProducts.filter((product) => {
    // 1. Filter by section (if applicable)
    if (currentSection && product.section !== currentSection) return false;
    
    // 2. Filter by selected categories (sidebar)
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;

    // 3. Filter by search term
    if (searchTerm) {
      const matchTitle = product.title.toLowerCase().includes(searchTerm);
      const matchCategory = product.category.toLowerCase().includes(searchTerm);
      if (!matchTitle && !matchCategory) return false;
    }

    return true;
  });

  // Apply Sorting
  displayProducts.sort((a, b) => {
    if (sortOrder === 'low') return a.salePrice - b.salePrice;
    if (sortOrder === 'high') return b.salePrice - a.salePrice;
    return 0; // featured (original array order)
  });

  const handleToggleCategory = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const sectionTitle = searchTerm 
    ? `Search Results for "${searchParams.get('search')}"` 
    : (currentSection ? currentSection.replace('-', ' ') : 'All Products');

  // Displaying only first 20 products initially or add pagination/virtualization in future
  // Because 100 on screen instantly might lag some browsers without native intersection observers
  // but we'll show all of them with lazy-load on images implemented in ProductCard!

  return (
    <div className="min-h-screen flex flex-col cinematic-bg relative overflow-hidden">
      {/* Background Gradient Mesh overlay */}
      <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Header Banner */}
        <div className="py-16 border-b border-gray-200/40 glass-surface mt-4 mx-4 sm:mx-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h1 className="text-center text-4xl lg:text-5xl tracking-[0.2em] font-serif text-[#1e1e1e] uppercase animate-fade-in-up">
            {sectionTitle}
          </h1>
          <p className="text-center mt-3 text-gray-500 max-w-xl mx-auto text-sm tracking-wide font-light animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Explore our massive collection of curated, handcrafted excellence globally sourced for your environment.
          </p>
        </div>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <SidebarFilters 
          selectedCategories={selectedCategories} 
          onToggleCategory={handleToggleCategory} 
        />
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="text-sm text-gray-500 font-medium">
              Showing {displayProducts.length} results
            </div>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
              {/* Custom Sort Dropdown */}
              <div className="relative group/sort">
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  <span>Sort by: {sortOrder === 'low' ? 'Price, low to high' : sortOrder === 'high' ? 'Price, high to low' : 'Featured'}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all duration-200 z-50 rounded-sm">
                  <div className="py-2">
                    <button onClick={() => setSortOrder('featured')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">Featured</button>
                    <button onClick={() => setSortOrder('high')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">Price, high to low</button>
                    <button onClick={() => setSortOrder('low')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">Price, low to high</button>
                  </div>
                </div>
              </div>

              {/* View Layout Toggle */}
              <div className="flex justify-end items-center gap-1 border-l border-gray-300 pl-6 cursor-not-allowed opacity-60">
                <button className="p-2 border border-gray-200 bg-white text-gray-400 pointer-events-none">
                  <AlignJustify size={18} strokeWidth={1.5} />
                </button>
                <button className="p-2 border border-gray-200 bg-white text-gray-400 pointer-events-none">
                  <GripHorizontal size={18} strokeWidth={1.5} />
                </button>
                <button className="p-2 border border-gray-200 bg-white text-gray-400 pointer-events-none">
                  <Grid3x3 size={18} strokeWidth={1.5} />
                </button>
                <button className="p-2 border border-gray-200 bg-white text-black pointer-events-none">
                  <Grid size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid - staggered fade in */}
          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-500">
              Loading Products...
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 pb-20 fade-in-stagger" style={{ perspective: '1200px' }}>
              {displayProducts.map((product, idx) => (
                <div key={product.id} className="animate-item" style={{ '--stagger': idx % 20 }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No products found matching your filters.
            </div>
          )}
        </div>
      </main>

      <RecentPurchasePopup />
      </div>
    </div>
  );
};

export default Shop;
