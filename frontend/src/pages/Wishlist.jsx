import React from 'react';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/product/ProductCard';
import useStore from '../store/useStore';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl tracking-widest font-serif text-[#333333] uppercase">
            Wishlist
          </h1>
          <p className="text-gray-500 mt-2">Curate your perfect space.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <Heart size={48} className="text-gray-300 mb-4" />
            <h2 className="text-xl text-gray-700 mb-2 font-medium">Nothing liked yet</h2>
            <p className="text-gray-500 mb-6">Heart the pieces you love and they will save here.</p>
            <Link to="/" className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition-colors uppercase">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
