import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  
  const isLiked = wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Scale down the rotation effect so it's subtle, premium
    const rotateX = ((y - centerY) / centerY) * -15; // -15 to 15 deg
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div 
      className="group flex flex-col items-center cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* 3D Tilt Wrapper */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="w-full aspect-square overflow-hidden mb-5 bg-[#F9F9F9] relative shadow-sm rounded-md transition-all duration-300 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovering ? 1.05 : 1})`,
          boxShadow: isHovering ? '0 30px 60px -15px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Cinematic Glare Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-md"
          style={{
            background: `radial-gradient(circle at ${isHovering ? '50% 50%' : '50% -20%'}, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
            opacity: isHovering ? 1 : 0
          }}
        />

        {/* Action Buttons with Glassmorphism */}
        <div 
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-4 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ transform: 'translateZ(30px)' }} // Pops out in Z-space
        >
          <button 
            onClick={handleToggleWishlist}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md ${isLiked ? 'bg-red-500/90 text-white' : 'bg-white/80 text-gray-800 hover:bg-white'} border border-white/20 hover:scale-110 active:scale-95`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="w-11 h-11 rounded-full text-gray-800 flex items-center justify-center transition-all shadow-lg backdrop-blur-md bg-white/80 hover:bg-white border border-white/20 hover:scale-110 active:scale-95"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      
      <div className="text-center px-4">
        <h3 className="text-sm font-serif text-gray-900 leading-relaxed mb-1 group-hover:text-gray-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-center space-x-2 mt-2 text-[0.9rem]">
          <span className="text-red-500 font-medium">Rs. {product.salePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="text-gray-400 line-through text-sm">Rs. {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
