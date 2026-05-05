import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import useStore from '../../store/useStore';

const Navbar = () => {
  const { cart, wishlist, user } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Announcement / Login Bar */}
      <div className="w-full bg-gray-900 text-white text-[0.7rem] sm:text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="hidden sm:block text-gray-300 font-medium tracking-wider">
            FREE SHIPPING ON ALL ORDERS OVER RS. 2000
          </div>
          <div className="flex space-x-3 sm:space-x-4 items-center w-full sm:w-auto justify-center sm:justify-end">
            <Link to="/login" className="hover:text-gray-300 transition-colors font-medium tracking-wide">
              Customer Login
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/vendor-login" className="hover:text-gray-300 transition-colors font-medium tracking-wide text-[#d4af37]">
              Artisan / Vendor Login
            </Link>
          </div>
        </div>
      </div>

      <nav className="w-full bg-[#FAF9F6] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left Navigation */}
          <div className="hidden xl:flex space-x-6 flex-1">
            <Link to="/" className="text-sm font-semibold tracking-wide text-gray-900 hover:text-gray-600 transition-colors">Home</Link>
            <Link to="/shop/wall-clocks" className="text-sm font-semibold tracking-wide text-gray-900 hover:text-gray-600 transition-colors">Wall Clocks</Link>
            <Link to="/shop/wall-art" className="text-sm font-semibold tracking-wide text-gray-900 hover:text-gray-600 transition-colors">Wall Art</Link>
            <Link to="/shop/mirrors" className="text-sm font-semibold tracking-wide text-gray-900 hover:text-gray-600 transition-colors">Mirrors</Link>
            <Link to="/shop/tables" className="text-sm font-semibold tracking-wide text-gray-900 hover:text-gray-600 transition-colors">Tables</Link>
            <Link to="/shop/pots-pottery" className="text-sm font-semibold tracking-wide text-gray-900 hover:text-gray-600 transition-colors">Pots & Pottery</Link>
            <Link to="/contact" className="text-sm font-semibold tracking-wide text-gray-900 hover:text-gray-600 transition-colors">Contact us</Link>
          </div>

          {/* Mobile Hamburger (Left) */}
          <div className="flex xl:hidden flex-1 items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 hover:text-gray-600 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Center Logo */}
          <Link to="/" className="flex flex-col items-center cursor-pointer flex-shrink-0 px-4">
            <h1 className="text-4xl tracking-widest font-serif font-black text-gray-900 lowercase" style={{ fontWeight: 900 }}>artsadobe</h1>
            <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gray-500 mt-1 font-sans font-medium">Original & Handcrafted</p>
          </Link>

          {/* Right Icons */}
          <div className="flex space-x-5 items-center flex-1 justify-end">
            <button 
              className={`transition-colors ${isSearchOpen ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>
            <Link to={user ? "/profile" : "/login"} className="text-gray-600 hover:text-gray-900 transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              <Heart size={20} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[0.65rem] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[0.65rem] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <div 
        className={`w-full bg-[#FAF9F6] border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          isSearchOpen ? 'max-h-24 py-4 opacity-100' : 'max-h-0 py-0 border-transparent opacity-0'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={18} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Search for handcrafted art, clocks, tables..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full py-3 pl-12 pr-20 text-sm focus:outline-none focus:border-gray-400 focus:shadow-sm transition-all"
              autoFocus={isSearchOpen}
            />
            <button type="submit" className="absolute right-4 text-xs font-semibold text-gray-900 tracking-wider uppercase hover:text-gray-600 transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200 absolute w-full left-0 shadow-lg">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 hover:text-gray-600">Home</Link>
            <Link to="/shop/wall-clocks" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 hover:text-gray-600">Wall Clocks</Link>
            <Link to="/shop/wall-art" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 hover:text-gray-600">Wall Art</Link>
            <Link to="/shop/mirrors" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 hover:text-gray-600">Mirrors</Link>
            <Link to="/shop/tables" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 hover:text-gray-600">Tables</Link>
            <Link to="/shop/pots-pottery" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 hover:text-gray-600">Pots & Pottery</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-900 hover:text-gray-600">Contact us</Link>
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
