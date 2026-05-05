import React, { useState, useEffect } from 'react';

const RecentPurchasePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 3 seconds
    const timer1 = setTimeout(() => setIsVisible(true), 3000);
    // Hide after 10 seconds
    const timer2 = setTimeout(() => setIsVisible(false), 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-fade-in-up">
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-full p-2 pr-6 flex items-center gap-3 cursor-pointer hover:bg-white transition-colors max-w-sm">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=150" 
            alt="Product Thumbnail" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-gray-900">Someone from Gurugram, IN</p>
          <p className="text-gray-500 mt-0.5">
            bought <span className="font-medium text-gray-700">Designer Luxury Premium ...</span>
          </p>
          <p className="text-gray-400 mt-0.5" style={{ fontSize: '10px' }}>2 weeks ago</p>
        </div>
      </div>
    </div>
  );
};

export default RecentPurchasePopup;
